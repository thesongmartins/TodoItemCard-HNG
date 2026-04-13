export function $(selector, ctx = document) {
  const el = ctx.querySelector(selector);
  if (!el) throw new Error(`[dom] Cannot find element: "${selector}"`);
  return el;
}

export function byTestId(id) {
  return $(`[data-testid="${id}"]`);
}

export function getFocusable(container) {
  const selector = [
    "button",
    "[href]",
    "input",
    "select",
    "textarea",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");
  return Array.from(container.querySelectorAll(selector)).filter(
    (el) => !el.hasAttribute("disabled"),
  );
}

export function trapFocus(container, e) {
  const focusable = getFocusable(container);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.key !== "Tab") return;
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}
