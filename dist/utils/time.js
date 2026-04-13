const MINUTE = 60000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function getTimeRemaining(target) {
  const diffMs = target.getTime() - Date.now();

  if (Math.abs(diffMs) <= 3 * MINUTE) {
    return { text: "Due now!", state: "due-now" };
  }

  if (diffMs < 0) {
    const abs = Math.abs(diffMs);
    if (abs < HOUR) {
      const m = Math.floor(abs / MINUTE);
      return {
        text: `Overdue by ${m} minute${m !== 1 ? "s" : ""}`,
        state: "overdue",
      };
    }
    if (abs < DAY) {
      const h = Math.floor(abs / HOUR);
      return {
        text: `Overdue by ${h} hour${h !== 1 ? "s" : ""}`,
        state: "overdue",
      };
    }
    const d = Math.floor(abs / DAY);
    return {
      text: `Overdue by ${d} day${d !== 1 ? "s" : ""}`,
      state: "overdue",
    };
  }

  if (diffMs <= HOUR) {
    const m = Math.floor(diffMs / MINUTE);
    return {
      text: `Due in ${m} minute${m !== 1 ? "s" : ""}`,
      state: "due-soon",
    };
  }
  if (diffMs <= DAY) {
    const h = Math.floor(diffMs / HOUR);
    return {
      text: `Due in ${h} hour${h !== 1 ? "s" : ""}`,
      state: h <= 3 ? "due-soon" : "future",
    };
  }
  if (diffMs <= 2 * DAY) {
    return { text: "Due tomorrow", state: "future" };
  }
  const d = Math.floor(diffMs / DAY);
  return { text: `Due in ${d} day${d !== 1 ? "s" : ""}`, state: "future" };
}
