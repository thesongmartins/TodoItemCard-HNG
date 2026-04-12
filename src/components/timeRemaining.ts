import { byTestId } from "../utils/dom";
import { getTimeRemaining } from "../utils/time";

export const DUE_DATE = new Date("2026-05-09T09:00:00Z");
export const REFRESH_S = 60;

const STATE_CLASSES = ["overdue", "due-now", "due-soon"] as const;

export function updateTimeRemaining(): void {
  const timeEl = byTestId<HTMLTimeElement>("test-todo-time-remaining");
  const textEl = timeEl.querySelector<HTMLElement>(".time-text");
  if (!textEl) return;

  const { text, state } = getTimeRemaining(DUE_DATE);

  textEl.textContent = text;
  timeEl.setAttribute("datetime", DUE_DATE.toISOString());
  timeEl.setAttribute("aria-label", `Time remaining: ${text}`);

  // Reset then apply only the relevant state class
  timeEl.classList.remove(...STATE_CLASSES);
  if (state !== "future") timeEl.classList.add(state);
}
