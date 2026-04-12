import { $, byTestId } from "../utils/dom";
import { openModal, closeModal, initOverlayClose } from "./modal";
import { syncCheckboxState } from "./checkbox";
import type { Priority, Status, PriorityConfig, StatusConfig } from "../types";

// Badge configuration maps

const PRIORITY_MAP: Record<Priority, PriorityConfig> = {
  high: { cls: "badge-high", label: "Priority: High", text: "HIGH" },
  medium: { cls: "badge-medium", label: "Priority: Medium", text: "MEDIUM" },
  low: { cls: "badge-low", label: "Priority: Low", text: "LOW" },
};

const STATUS_MAP: Record<Status, StatusConfig> = {
  "in-progress": { cls: "badge-in-progress", label: "Status: In Progress" },
  done: { cls: "badge-done", label: "Status: Done" },
  pending: { cls: "badge-pending", label: "Status: Pending" },
};

// Private helpers

/** Mutates the priority badge on the card. */
function applyPriority(newPriority: Priority): void {
  const priorityEl = byTestId<HTMLElement>("test-todo-priority");
  const { cls, label, text } = PRIORITY_MAP[newPriority];
  const dot = `<span class="badge-dot" aria-hidden="true"></span>`;

  priorityEl.className = `badge badge-priority ${cls}`;
  priorityEl.setAttribute("aria-label", label);
  priorityEl.innerHTML = `${dot}${text}`;
}

/** Mutates the status badge on the card (including pulsing dot for in-progress). */
function applyStatus(newStatus: Status): void {
  const statusEl = byTestId<HTMLElement>("test-todo-status");
  const { cls, label } = STATUS_MAP[newStatus];

  statusEl.className = `badge badge-status ${cls}`;
  statusEl.setAttribute("aria-label", label);

  if (newStatus === "in-progress") {
    statusEl.innerHTML = `<span class="status-pulse" aria-hidden="true"></span>IN PROGRESS`;
  } else {
    statusEl.textContent = newStatus === "done" ? "DONE" : "PENDING";
  }
}

export function initEditModal(): void {
  const modal = $<HTMLElement>("#edit-modal");
  const editBtn = byTestId<HTMLButtonElement>("test-todo-edit-button");
  const closeBtn = $<HTMLButtonElement>("#edit-modal-close");
  const cancelBtn = $<HTMLButtonElement>("#edit-cancel");
  const saveBtn = $<HTMLButtonElement>("#edit-save");

  // Card elements that get mutated on save
  const titleEl = byTestId<HTMLElement>("test-todo-title");
  const descEl = byTestId<HTMLElement>("test-todo-description");

  // Form inputs
  const inputTitle = $<HTMLInputElement>("#edit-title");
  const inputDesc = $<HTMLTextAreaElement>("#edit-description");
  const inputPriority = $<HTMLSelectElement>("#edit-priority");
  const inputStatus = $<HTMLSelectElement>("#edit-status");

  initOverlayClose(modal);

  // Open
  editBtn.addEventListener("click", () => {
    console.log("✏️  Edit clicked");

    // Pre-fill form with live card values
    inputTitle.value = titleEl.textContent?.trim() ?? "";
    inputDesc.value = descEl.textContent?.trim() ?? "";

    openModal(modal, "edit-title");
  });

  // Close (no save)
  closeBtn.addEventListener("click", () => closeModal(modal));
  cancelBtn.addEventListener("click", () => closeModal(modal));

  // Save
  saveBtn.addEventListener("click", () => {
    const newTitle = inputTitle.value.trim();
    const newDesc = inputDesc.value.trim();
    const newPriority = inputPriority.value as Priority;
    const newStatus = inputStatus.value as Status;

    // Validate
    if (!newTitle) {
      inputTitle.setCustomValidity("Title cannot be empty");
      inputTitle.reportValidity();
      return;
    }
    inputTitle.setCustomValidity("");

    // Commit changes
    titleEl.textContent = newTitle;
    descEl.textContent = newDesc;

    // Keep delete modal task-name in sync
    const deleteName = document.getElementById("delete-task-name");
    if (deleteName) deleteName.textContent = `"${newTitle}"`;

    applyPriority(newPriority);
    applyStatus(newStatus);
    syncCheckboxState(newStatus === "done");

    closeModal(modal);
  });
}
