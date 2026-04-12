# Todo Item Card

A clean, fully accessible, and testable **Todo Task Card** component built with **vanilla TypeScript** — no frameworks, no runtime dependencies.

Live demo: []()

## Features

| Feature                | Detail                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------- |
| **Testable**           | Every interactive element has a unique `data-testid` matching the spec             |
| **Accessible**         | WCAG 2.1 AA — visible focus rings, ARIA labels, live regions, focus trap in modals |
| **Keyboard navigable** | `Tab → checkbox → Edit → Delete`; Escape closes modals                             |
| **Live countdown**     | Time-remaining auto-refreshes every 60 seconds                                     |
| **Responsive**         | Works at every viewport from 320 px to 1200 px                                     |
| **Polished UI**        | Glassmorphic emerald dark theme with animated accent bar                           |
| **Edit modal**         | Updates title, description, priority, and status live on the card                  |
| **Delete modal**       | Confirmation dialogue before destructive action                                    |
| **Code-split TS**      | Source split into focused single-responsibility modules                            |

---

## `data-testid` Reference

All IDs match the automated-test spec exactly.

| Element                   | `data-testid`               |
| ------------------------- | --------------------------- |
| Card root (`<article>`)   | `test-todo-card`            |
| Task title (`<h2>`)       | `test-todo-title`           |
| Description (`<p>`)       | `test-todo-description`     |
| Priority badge            | `test-todo-priority`        |
| Due date (`<time>`)       | `test-todo-due-date`        |
| Time remaining (`<time>`) | `test-todo-time-remaining`  |
| Status badge              | `test-todo-status`          |
| Completion checkbox       | `test-todo-complete-toggle` |
| Tags list (`<ul>`)        | `test-todo-tags`            |
| Work tag                  | `test-todo-tag-work`        |
| Urgent tag                | `test-todo-tag-urgent`      |
| Edit button               | `test-todo-edit-button`     |
| Delete button             | `test-todo-delete-button`   |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18 (only needed to compile TypeScript)
- A modern browser (Chrome, Firefox, Safari, Edge)

### Run without a build step

Because `dist/main.js` is committed as a pre-built IIFE bundle, you can open the project directly in a browser — no install required:

```bash
# macOS / Linux
open index.html

# Windows
start index.html
```

Or serve it locally to avoid any file:// restrictions:

```bash
npx serve .
# → http://localhost:3000
```

### Develop with TypeScript

```bash
# 1. Install TypeScript
npm install

# 2. Watch-compile src/ → dist/
npm run watch

# 3. Open index.html in your browser (live-server recommended)
npx live-server .
```

### Build once

```bash
npm run build
# Compiles src/main.ts (and all imports) → dist/main.js
```

## Accessibility

- All interactive elements have visible focus rings (`outline: 2px solid #34d399`)
- Checkbox has an `aria-label` — no reliance on visual-only context
- Priority badge uses `role="img"` + `aria-label`
- Status badge uses `role="status"` + `aria-live="polite"`
- Time-remaining container has `aria-live="polite"` + `aria-atomic="true"`
- Modals use `role="dialog"` + `aria-modal="true"` + `aria-labelledby`
- Focus is trapped inside open modals (`Tab` / `Shift+Tab` cycle)
- Closing a modal restores focus to the triggering element (WCAG 2.1 §2.4.3)
- `prefers-reduced-motion` disables all animations

---

## Tech Stack

| Layer  | Choice                                                            |
| ------ | ----------------------------------------------------------------- |
| Markup | Semantic HTML5                                                    |
| Styles | Vanilla CSS (custom properties + `clamp()`)                       |
| Logic  | Vanilla TypeScript → compiled IIFE bundle                         |
| Fonts  | [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts |
| Build  | `tsc` (TypeScript compiler)                                       |

---

## License

MIT — free to use, modify, and distribute.
