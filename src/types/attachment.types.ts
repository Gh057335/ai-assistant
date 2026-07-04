// A file the user attached to a message. Loaded 100% client-side — the file is
// never uploaded, POSTed, or read by any backend. `url` is a browser object URL
// (`URL.createObjectURL`) created in the composer, so preview/download stay
// entirely in the browser. See docs/handoff.md "frontend-only" boundary.
export interface Attachment {
  id: string;
  /** Original file name. */
  name: string;
  /** Size in bytes (for the chip label). */
  size: number;
  /** MIME type as reported by the browser. */
  type: string;
  /** Client-side object URL — opens/downloads the file with no network call. */
  url: string;
}
