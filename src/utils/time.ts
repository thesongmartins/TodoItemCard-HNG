/**
 * utils/time.ts
 * ─────────────────────────────────────────────────────────────────
 * Pure utility: converts a Date into a human-readable
 * "time remaining" string and a colour-state token.
 *
 * No DOM access — fully unit-testable in isolation.
 * ─────────────────────────────────────────────────────────────────
 */

import type { TimeResult } from "../types";

const MINUTE = 60_000;
const HOUR   = 60 * MINUTE;
const DAY    = 24 * HOUR;

/**
 * Returns how far `target` is from now.
 *
 * @example
 *   getTimeRemaining(new Date("2026-05-09")) // → { text: "Due in 27 days", state: "future" }
 */
export function getTimeRemaining(target: Date): TimeResult {
  const diffMs = target.getTime() - Date.now();

  // ── Due right now (within ±3 min) ──────────────────────────────
  if (Math.abs(diffMs) <= 3 * MINUTE) {
    return { text: "Due now!", state: "due-now" };
  }

  // ── Overdue ─────────────────────────────────────────────────────
  if (diffMs < 0) {
    const abs = Math.abs(diffMs);
    if (abs < HOUR) {
      const m = Math.floor(abs / MINUTE);
      return { text: `Overdue by ${m} minute${m !== 1 ? "s" : ""}`, state: "overdue" };
    }
    if (abs < DAY) {
      const h = Math.floor(abs / HOUR);
      return { text: `Overdue by ${h} hour${h !== 1 ? "s" : ""}`, state: "overdue" };
    }
    const d = Math.floor(abs / DAY);
    return { text: `Overdue by ${d} day${d !== 1 ? "s" : ""}`, state: "overdue" };
  }

  // ── Future ──────────────────────────────────────────────────────
  if (diffMs <= HOUR) {
    const m = Math.floor(diffMs / MINUTE);
    return { text: `Due in ${m} minute${m !== 1 ? "s" : ""}`, state: "due-soon" };
  }
  if (diffMs <= DAY) {
    const h = Math.floor(diffMs / HOUR);
    return { text: `Due in ${h} hour${h !== 1 ? "s" : ""}`, state: h <= 3 ? "due-soon" : "future" };
  }
  if (diffMs <= 2 * DAY) {
    return { text: "Due tomorrow", state: "future" };
  }
  const d = Math.floor(diffMs / DAY);
  return { text: `Due in ${d} day${d !== 1 ? "s" : ""}`, state: "future" };
}
