/**
 * utils/dom.ts
 * ─────────────────────────────────────────────────────────────────
 * Lightweight DOM helpers — typed wrappers around querySelector
 * and focus-management utilities.
 *
 * No business logic — safe to reuse across any project.
 * ─────────────────────────────────────────────────────────────────
 */
/**
 * Type-safe querySelector that throws if the element is not found.
 *
 * @param selector  CSS selector string.
 * @param ctx       Search root (defaults to `document`).
 */
export function $(selector, ctx = document) {
    const el = ctx.querySelector(selector);
    if (!el)
        throw new Error(`[dom] Cannot find element: "${selector}"`);
    return el;
}
/**
 * Queries an element by its `data-testid` attribute.
 *
 * @param id  The value of `data-testid` (without the attribute name).
 */
export function byTestId(id) {
    return $(`[data-testid="${id}"]`);
}
/**
 * Returns all keyboard-focusable child elements within a container.
 * Excludes disabled elements.
 */
export function getFocusable(container) {
    const selector = [
        "button",
        "[href]",
        "input",
        "select",
        "textarea",
        '[tabindex]:not([tabindex="-1"])',
    ].join(", ");
    return Array.from(container.querySelectorAll(selector)).filter((el) => !el.hasAttribute("disabled"));
}
/**
 * Implements a focus trap: keeps keyboard focus cycling inside `container`.
 * Call this inside a keydown handler.
 */
export function trapFocus(container, e) {
    const focusable = getFocusable(container);
    if (!focusable.length)
        return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.key !== "Tab")
        return;
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    }
    else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}
