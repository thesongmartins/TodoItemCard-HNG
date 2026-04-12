import { getFocusable, trapFocus } from "../utils/dom";
let triggerEl = null;
export function openModal(modal, firstFocusId) {
    triggerEl = document.activeElement;
    modal.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    // Focus target: explicit id if given, otherwise first focusable child
    const focusable = getFocusable(modal);
    const target = firstFocusId
        ? (modal.querySelector(`#${firstFocusId}`) ?? focusable[0])
        : focusable[0];
    target?.focus();
    // Keyboard: Escape closes, Tab stays trapped
    modal._keyHandler = (e) => {
        if (e.key === "Escape")
            closeModal(modal);
        trapFocus(modal, e);
    };
    document.addEventListener("keydown", modal._keyHandler);
}
export function closeModal(modal) {
    modal.setAttribute("hidden", "");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", modal._keyHandler);
    triggerEl?.focus();
    triggerEl = null;
}
export function initOverlayClose(modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal)
            closeModal(modal);
    });
}
