import { $, byTestId } from "../utils/dom";
import { openModal, closeModal, initOverlayClose } from "./modal";

const FADE_DURATION_MS = 400;
const RESTORE_DELAY_MS = 1_500;

export function initDeleteModal(): void {
  const modal = $<HTMLElement>("#delete-modal");
  const deleteBtn = byTestId<HTMLButtonElement>("test-todo-delete-button");
  const closeBtn = $<HTMLButtonElement>("#delete-modal-close");
  const cancelBtn = $<HTMLButtonElement>("#delete-cancel");
  const confirmBtn = $<HTMLButtonElement>("#delete-confirm");

  initOverlayClose(modal);

  // Open
  deleteBtn.addEventListener("click", () => {
    console.log("🗑️  Delete clicked");
    // Focus "Cancel" by default — safer for destructive actions
    openModal(modal, "delete-cancel");
  });

  // Close (no delete)
  closeBtn.addEventListener("click", () => closeModal(modal));
  cancelBtn.addEventListener("click", () => closeModal(modal));

  // Confirm delete
  confirmBtn.addEventListener("click", () => {
    console.log("🗑️  Delete confirmed");
    closeModal(modal);

    const card = byTestId<HTMLElement>("test-todo-card");

    card.style.transition = `opacity ${FADE_DURATION_MS}ms ease, transform ${FADE_DURATION_MS}ms ease`;
    card.style.opacity = "0";
    card.style.transform = "scale(0.96)";

    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "";
    }, RESTORE_DELAY_MS);
  });
}
