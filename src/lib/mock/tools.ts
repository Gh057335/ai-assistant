// Tool Picker Menu data. The `+` button in the composer opens a dropdown of
// these "tools"; selecting one sets the composer's active mode (see Composer).
// Front-end only — no backend. `icon` is a keyed name mapped to a lucide-react
// icon in the view (same pattern as quick-actions) — kept as pure data, no
// component imports here. Everything is configurable via the ToolPickerMenu
// `tools` prop; this is just the default set.

export type ToolAction = "upload" | "image_gen" | "web_search" | "deep_research";

export type ToolIcon = "paperclip" | "image" | "globe" | "bar-chart";

export interface Tool {
  /** Keyed icon name; resolved to a lucide icon in ToolPickerMenu. */
  icon: ToolIcon;
  label: string;
  description: string;
  action: ToolAction;
}

export const DEFAULT_TOOLS: Tool[] = [
  {
    icon: "paperclip",
    label: "Aggiungi foto e file",
    description: "Carica dal computer",
    action: "upload",
  },
  {
    icon: "image",
    label: "Crea immagine",
    description: "Rendi visibile ogni concetto",
    action: "image_gen",
  },
  {
    icon: "globe",
    label: "Ricerca sul web",
    description: "Trova notizie in tempo reale",
    action: "web_search",
  },
  {
    icon: "bar-chart",
    label: "Deep Research",
    description: "Ottieni un report dettagliato",
    action: "deep_research",
  },
];
