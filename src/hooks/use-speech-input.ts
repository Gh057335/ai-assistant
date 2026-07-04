"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

// Real microphone input: live speech-to-text via the browser-native Web Speech
// API, plus a genuine getUserMedia audio stream that drives a MediaRecorder
// (a playable clip) and an AnalyserNode (a live input-level meter). No backend
// — recognition runs through the browser's own speech service, capture and
// recording happen entirely client-side.

// --- Minimal Web Speech API typings (absent from the standard DOM lib) -------
interface SpeechRecognitionAlternative {
  readonly transcript: string;
}
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  readonly [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  readonly [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as typeof window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function getAudioContextCtor(): typeof AudioContext | null {
  if (typeof window === "undefined") return null;
  const w = window as typeof window & { webkitAudioContext?: typeof AudioContext };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

function messageForError(code: string): string | null {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone access denied";
    case "audio-capture":
      return "No microphone found";
    case "network":
      return "Speech service unreachable";
    case "no-speech":
    case "aborted":
      return null; // benign — user paused or stopped
    default:
      return "Voice input failed";
  }
}

export interface SpeechInputController {
  /** Whether the Web Speech API exists in this browser (resolved post-mount). */
  supported: boolean;
  /** True from the moment capture starts until it fully stops. */
  recording: boolean;
  /** Live input loudness, 0–1, for the mic-button pulse. */
  level: number;
  /** Human-readable failure (permission denied, no mic, …), else null. */
  error: string | null;
  /** Object URL of the last recorded clip, or null. Revoked on discard/unmount. */
  clipUrl: string | null;
  /** Start capture if idle, stop and finalize if recording. */
  toggle: () => void;
  /** Force-stop capture (e.g. when the message is sent). */
  stop: () => void;
  /** Drop the recorded clip and revoke its URL. */
  discardClip: () => void;
}

interface Options {
  /** Current composer text — dictation is appended onto this snapshot. */
  value: string;
  /** Commit updated composer text. */
  onChange: (value: string) => void;
  /** BCP-47 recognition language. */
  lang?: string;
}

// Client-only capability flag: server snapshot is false, client re-checks after
// hydration — no mismatch, no setState-in-effect.
const NOOP_SUBSCRIBE = () => () => {};

export function useSpeechInput({ value, onChange, lang = "en-US" }: Options): SpeechInputController {
  const supported = useSyncExternalStore(
    NOOP_SUBSCRIBE,
    () => getRecognitionCtor() !== null,
    () => false,
  );
  const [recording, setRecording] = useState(false);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [clipUrl, setClipUrl] = useState<string | null>(null);

  // Latest composer value, read inside async/event callbacks without re-binding.
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    valueRef.current = value;
    onChangeRef.current = onChange;
  }, [value, onChange]);

  // Live capture handles, all torn down together in stopAll().
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const clipUrlRef = useRef<string | null>(null);

  // Dictation bookkeeping: text present before speaking + finalized results.
  const baseRef = useRef("");
  const finalRef = useRef("");

  const stopAll = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") recorder.stop();
    recorderRef.current = null;

    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.onend = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.stop();
      recognitionRef.current = null;
    }

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    const ctx = audioCtxRef.current;
    if (ctx && ctx.state !== "closed") void ctx.close();
    audioCtxRef.current = null;

    setLevel(0);
    setRecording(false);
  }, []);

  const setClip = useCallback((url: string | null) => {
    if (clipUrlRef.current) URL.revokeObjectURL(clipUrlRef.current);
    clipUrlRef.current = url;
    setClipUrl(url);
  }, []);

  const discardClip = useCallback(() => setClip(null), [setClip]);

  const start = useCallback(async () => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    setError(null);

    // 1. Acquire a real mic stream first — this surfaces the permission prompt
    //    and lets us fail cleanly before touching the recognizer.
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError("Microphone access denied");
      return;
    }
    streamRef.current = stream;

    // 2. Record a playable clip from that same stream.
    setClip(null);
    try {
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = () => {
        if (chunks.length) setClip(URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType })));
      };
      recorder.start();
      recorderRef.current = recorder;
    } catch {
      // Recording is best-effort; dictation still proceeds without it.
    }

    // 3. Drive a live loudness meter off an AnalyserNode (no output routing).
    const AudioCtor = getAudioContextCtor();
    if (AudioCtor) {
      const ctx = new AudioCtor();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const buffer = new Uint8Array(analyser.fftSize);
      const tick = () => {
        analyser.getByteTimeDomainData(buffer);
        let sum = 0;
        for (const sample of buffer) {
          const v = (sample - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / buffer.length);
        setLevel(Math.min(1, rms * 3.2));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }

    // 4. Start live speech-to-text, appending onto the current composer text.
    const base = valueRef.current.trimEnd();
    baseRef.current = base.length ? `${base} ` : "";
    finalRef.current = "";

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) finalRef.current += text;
        else interim += text;
      }
      onChangeRef.current(baseRef.current + finalRef.current + interim);
    };
    recognition.onerror = (e) => {
      const msg = messageForError(e.error);
      if (msg) setError(msg);
      if (e.error === "not-allowed" || e.error === "service-not-allowed" || e.error === "audio-capture") {
        stopAll();
      }
    };
    recognition.onend = () => stopAll();
    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch {
      // Some browsers throw if start() races a prior session — reset cleanly.
      stopAll();
      return;
    }

    setRecording(true);
  }, [lang, setClip, stopAll]);

  const stop = useCallback(() => stopAll(), [stopAll]);
  const toggle = useCallback(() => {
    if (recording) stopAll();
    else void start();
  }, [recording, start, stopAll]);

  // Tear everything down on unmount, including any lingering clip URL.
  useEffect(() => {
    return () => {
      stopAll();
      if (clipUrlRef.current) URL.revokeObjectURL(clipUrlRef.current);
    };
  }, [stopAll]);

  return { supported, recording, level, error, clipUrl, toggle, stop, discardClip };
}
