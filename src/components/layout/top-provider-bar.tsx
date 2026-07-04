"use client";

import { useState, type FocusEvent } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useApp } from "@/hooks/use-app";
import { AgentList } from "@/components/agent-list";
import type { Agent } from "@/types/agent.types";
import type { Model } from "@/types/model.types";
import { cn, readableOn } from "@/lib/utils";
import { TopbarModal } from "./topbar-modal";

// Which topbar trigger currently owns the shared popup. Only model tabs open it
// now — the Specialist trigger is a hover popover, not a modal.
type ModalState = { kind: "model"; model: Model } | null;

// Persistent topbar model switcher. Every model tab carries a tint of its own
// brand color; hovering reveals a popover painted with that model's SOLID brand
// background (contrast-checked text) where each sub-model is its own clickable
// row. Clicking a tab selects the model AND opens the shared popup. After all
// models comes the Specialist trigger, which hover-reveals the same agent list
// (identical popup style) that the composer's Specialist dropdown shows.
export function TopProviderBar() {
  const { models, agents, activeModel, activeSubModel, activeAgent, selectModel, selectAgent } =
    useApp();
  const [modal, setModal] = useState<ModalState>(null);

  return (
    <>
      <nav
        aria-label="Model"
        className="flex items-center gap-1.5 border-b border-[var(--border)] bg-[var(--bg-secondary)]/70 px-3 py-2 backdrop-blur"
      >
        {models.map((model) => (
          <ModelTab
            key={model.id}
            model={model}
            active={model.id === activeModel.id}
            activeSubModel={model.id === activeModel.id ? activeSubModel : null}
            onSelectModel={() => {
              selectModel(model.id);
              setModal({ kind: "model", model });
            }}
            onSelectSubModel={(name) => selectModel(model.id, name)}
          />
        ))}

        {/* After the list of all models: the Specialist trigger. It shares the
            model tabs' sizing/spacing, and on hover reveals the exact agent list
            popup used by the composer's Specialist dropdown. */}
        <SpecialistPopover agents={agents} activeAgentId={activeAgent.id} onSelect={selectAgent} />
      </nav>

      {/* Shared shell for model-tab clicks — opens, closes, and animates the
          same way for every model. */}
      <TopbarModal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.kind === "model" ? modal.model.name : ""}
        description={
          modal?.kind === "model" ? `Details and variants for ${modal.model.name}.` : undefined
        }
        accent={modal?.kind === "model" ? modal.model.accentColor : undefined}
      >
        {modal?.kind === "model" && (
          <ModelModalBody
            model={modal.model}
            activeSubModel={activeModel.id === modal.model.id ? activeSubModel : null}
            onSelectSubModel={(name) => selectModel(modal.model.id, name)}
          />
        )}
      </TopbarModal>
    </>
  );
}

// Top-bar "Specialist" — matches the model tabs' shape, and on hover (or
// keyboard focus) reveals the shared AgentList: the SAME popup, rows, and
// staggered entrance the composer's Specialist dropdown uses. Mounting on hover
// (rather than a CSS toggle) replays that entrance each time, like the composer
// dropdown reopening. The pt-2 bridge keeps the hover alive across the gap.
function SpecialistPopover({
  agents,
  activeAgentId,
  onSelect,
}: {
  agents: Agent[];
  activeAgentId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  // Close only when focus leaves the whole trigger+popover subtree, so keyboard
  // users can tab from the button into the list.
  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={onBlur}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <Sparkles className="size-3.5" />
        Specialist
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 pt-2">
          <AgentList
            agents={agents}
            activeAgentId={activeAgentId}
            onSelect={(id) => {
              onSelect(id);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

function ModelTab({
  model,
  active,
  activeSubModel,
  onSelectModel,
  onSelectSubModel,
}: {
  model: Model;
  active: boolean;
  activeSubModel: string | null;
  onSelectModel: () => void;
  onSelectSubModel: (name: string) => void;
}) {
  const accent = model.accentColor;
  const onAccent = readableOn(accent);
  const darkText = onAccent === "#0a0a0a";
  // Overlays computed from the readable color so hover/selection stay legible
  // on any brand background.
  const hoverOverlay = darkText ? "hover:bg-black/10" : "hover:bg-white/15";
  const selectedOverlay = darkText ? "bg-black/15" : "bg-white/20";

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={onSelectModel}
        aria-current={active ? "true" : undefined}
        className={cn(
          "relative flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
          active ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
        )}
      >
        <motion.span
          className="size-2 rounded-full"
          animate={{ scale: active ? 1 : 0.55, opacity: active ? 1 : 0.55 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ backgroundColor: accent }}
        />
        {model.name}
        {active && (
          <motion.span
            layoutId="provider-underline"
            className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full"
            style={{ backgroundColor: accent }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          />
        )}
      </button>

      {/* Sub-model popover — pt-2 bridges the gap so hover doesn't drop. */}
      <div className="invisible absolute left-0 top-full z-30 pt-2 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100">
        <div
          className="w-64 overflow-hidden rounded-xl border border-white/10 p-1 shadow-2xl"
          style={{ backgroundColor: accent, color: onAccent }}
        >
          <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: onAccent, opacity: 0.75 }}>
            {model.provider} · pick per task
          </p>
          {model.subModels.map((sub) => {
            const selected = sub.name === activeSubModel;
            return (
              <button
                key={sub.name}
                type="button"
                onClick={() => onSelectSubModel(sub.name)}
                aria-pressed={selected}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current",
                  selected ? selectedOverlay : hoverOverlay,
                )}
              >
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: onAccent }}>
                    {sub.name}
                    {selected && <Check className="size-3.5" />}
                  </span>
                  <span className="block text-[11px]" style={{ color: onAccent, opacity: 0.8 }}>
                    Best for {sub.bestFor}
                  </span>
                </span>
                {sub.recommended && (
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{ backgroundColor: onAccent, color: accent }}
                  >
                    Recommended
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Popup body for a model tab: identity + specs, then the same clickable variant
// rows the hover popover offers (selecting one records the sub-model, as before).
function ModelModalBody({
  model,
  activeSubModel,
  onSelectSubModel,
}: {
  model: Model;
  activeSubModel: string | null;
  onSelectSubModel: (name: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          {model.provider}
        </p>
        <p className="mt-1 text-[13px] text-[var(--text-primary)]">{model.description}</p>
      </div>

      <dl className="grid grid-cols-2 gap-2 text-[12px]">
        <Spec label="Context" value={`${(model.contextWindow / 1000).toLocaleString()}K tokens`} />
        <Spec label="Price" value={`$${model.priceMtok}/Mtok`} />
        <Spec label="Availability" value={model.availability} />
        <Spec label="Best pick" value={model.subModels.find((s) => s.recommended)?.name ?? "—"} />
      </dl>

      <div>
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          Variants · pick per task
        </p>
        <div className="space-y-1">
          {model.subModels.map((sub) => {
            const selected = sub.name === activeSubModel;
            return (
              <button
                key={sub.name}
                type="button"
                onClick={() => onSelectSubModel(sub.name)}
                aria-pressed={selected}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                  selected
                    ? "border-[var(--accent)] bg-[var(--bg-hover)]"
                    : "border-[var(--border)] hover:bg-[var(--bg-hover)]",
                )}
              >
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--text-primary)]">
                    {sub.name}
                    {selected && <Check className="size-3.5 text-[var(--accent)]" />}
                  </span>
                  <span className="block text-[11px] text-[var(--text-secondary)]">Best for {sub.bestFor}</span>
                </span>
                {sub.recommended && (
                  <span className="shrink-0 rounded-full bg-[var(--bg-hover)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-secondary)]">
                    Recommended
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] px-2.5 py-1.5">
      <dt className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">{label}</dt>
      <dd className="mt-0.5 text-[12px] font-medium capitalize text-[var(--text-primary)]">{value}</dd>
    </div>
  );
}
