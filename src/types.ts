export type TimeState = "overdue" | "due-now" | "due-soon" | "future";

export type Priority = "low" | "medium" | "high";

export type Status = "pending" | "in-progress" | "done";

export interface TimeResult {
  text: string;
  state: TimeState;
}

export interface PriorityConfig {
  cls: string;
  label: string;
  text: string;
}

export interface StatusConfig {
  cls: string;
  label: string;
}

/** Augment HTMLElement with a modal keyboard-handler reference. */
declare global {
  interface HTMLElement {
    _keyHandler: (e: KeyboardEvent) => void;
  }
}
