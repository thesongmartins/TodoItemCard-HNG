import { byTestId } from "../utils/dom";

const DONE_HTML = "DONE";
const IN_PROGRESS_HTML = `<span class="status-pulse" aria-hidden="true"></span>IN PROGRESS`;

export function applyCompletionState(done: boolean): void {
  const titleEl = byTestId<HTMLElement>("test-todo-title");
  const statusEl = byTestId<HTMLElement>("test-todo-status");

  titleEl.classList.toggle("is-done", done);

  if (done) {
    statusEl.className = "badge badge-status badge-done";
    statusEl.setAttribute("aria-label", "Status: Done");
    statusEl.textContent = DONE_HTML;
  } else {
    statusEl.className = "badge badge-status badge-in-progress";
    statusEl.setAttribute("aria-label", "Status: In Progress");
    statusEl.innerHTML = IN_PROGRESS_HTML;
  }
}

export function initCheckbox(): void {
  const checkbox = byTestId<HTMLInputElement>("test-todo-complete-toggle");
  checkbox.addEventListener("change", () =>
    applyCompletionState(checkbox.checked),
  );
}

export function syncCheckboxState(isDone: boolean): void {
  const checkbox = byTestId<HTMLInputElement>("test-todo-complete-toggle");
  checkbox.checked = isDone;
  applyCompletionState(isDone);
}
