import { byTestId } from "../utils/dom";
const DONE_HTML = "DONE";
const IN_PROGRESS_HTML = `<span class="status-pulse" aria-hidden="true"></span>IN PROGRESS`;
export function applyCompletionState(done) {
  const titleEl = byTestId("test-todo-title");
  const statusEl = byTestId("test-todo-status");
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
export function initCheckbox() {
  const checkbox = byTestId("test-todo-complete-toggle");
  checkbox.addEventListener("change", () =>
    applyCompletionState(checkbox.checked),
  );
}
export function syncCheckboxState(isDone) {
  const checkbox = byTestId("test-todo-complete-toggle");
  checkbox.checked = isDone;
  applyCompletionState(isDone);
}
