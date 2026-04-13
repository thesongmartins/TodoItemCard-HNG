(function () {
  "use strict";

  // utils/time.ts

  const MINUTE = 60_000;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;

  function getTimeRemaining(target) {
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

  // utils/dom.ts

  function $(selector, ctx) {
    ctx = ctx || document;
    const el = ctx.querySelector(selector);
    if (!el) throw new Error(`[dom] Cannot find element: "${selector}"`);
    return el;
  }

  function byTestId(id) {
    return $(`[data-testid="${id}"]`);
  }

  function getFocusable(container) {
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

  function trapFocus(container, e) {
    const focusable = getFocusable(container);
    if (!focusable.length || e.key !== "Tab") return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // components/modal.ts

  let triggerEl = null;

  function openModal(modal, firstFocusId) {
    triggerEl = document.activeElement;
    modal.removeAttribute("hidden");
    document.body.style.overflow = "hidden";

    const focusable = getFocusable(modal);
    const target = firstFocusId
      ? modal.querySelector(`#${firstFocusId}`) || focusable[0]
      : focusable[0];
    if (target) target.focus();

    modal._keyHandler = (e) => {
      if (e.key === "Escape") closeModal(modal);
      trapFocus(modal, e);
    };
    document.addEventListener("keydown", modal._keyHandler);
  }

  function closeModal(modal) {
    modal.setAttribute("hidden", "");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", modal._keyHandler);
    if (triggerEl) triggerEl.focus();
    triggerEl = null;
  }

  function initOverlayClose(modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });
  }

  // components/timeRemaining.ts

  const DUE_DATE = new Date("2026-05-09T09:00:00Z");
  const REFRESH_S = 60; // seconds
  const STATE_CLASSES = ["overdue", "due-now", "due-soon"];

  function updateTimeRemaining() {
    const timeEl = byTestId("test-todo-time-remaining");
    const textEl = timeEl.querySelector(".time-text");
    if (!textEl) return;

    const { text, state } = getTimeRemaining(DUE_DATE);

    textEl.textContent = text;
    timeEl.setAttribute("datetime", DUE_DATE.toISOString());
    timeEl.setAttribute("aria-label", `Time remaining: ${text}`);

    timeEl.classList.remove(...STATE_CLASSES);
    if (state !== "future") timeEl.classList.add(state);
  }

  // components/checkbox.ts

  const DONE_HTML = "DONE";
  const IN_PROGRESS_HTML = `<span class="status-pulse" aria-hidden="true"></span>IN PROGRESS`;

  function applyCompletionState(done) {
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

  function initCheckbox() {
    const checkbox = byTestId("test-todo-complete-toggle");
    checkbox.addEventListener("change", () =>
      applyCompletionState(checkbox.checked),
    );
  }

  function syncCheckboxState(isDone) {
    const checkbox = byTestId("test-todo-complete-toggle");
    checkbox.checked = isDone;
    applyCompletionState(isDone);
  }

  // components/editModal.ts

  const PRIORITY_MAP = {
    high: { cls: "badge-high", label: "Priority: High", text: "HIGH" },
    medium: { cls: "badge-medium", label: "Priority: Medium", text: "MEDIUM" },
    low: { cls: "badge-low", label: "Priority: Low", text: "LOW" },
  };

  const STATUS_MAP = {
    "in-progress": { cls: "badge-in-progress", label: "Status: In Progress" },
    done: { cls: "badge-done", label: "Status: Done" },
    pending: { cls: "badge-pending", label: "Status: Pending" },
  };

  function applyPriority(newPriority) {
    const priorityEl = byTestId("test-todo-priority");
    const { cls, label, text } = PRIORITY_MAP[newPriority];
    const dot = `<span class="badge-dot" aria-hidden="true"></span>`;
    priorityEl.className = `badge badge-priority ${cls}`;
    priorityEl.setAttribute("aria-label", label);
    priorityEl.innerHTML = `${dot}${text}`;
  }

  function applyStatus(newStatus) {
    const statusEl = byTestId("test-todo-status");
    const { cls, label } = STATUS_MAP[newStatus];
    statusEl.className = `badge badge-status ${cls}`;
    statusEl.setAttribute("aria-label", label);
    if (newStatus === "in-progress") {
      statusEl.innerHTML = `<span class="status-pulse" aria-hidden="true"></span>IN PROGRESS`;
    } else {
      statusEl.textContent = newStatus === "done" ? "DONE" : "PENDING";
    }
  }

  function initEditModal() {
    const modal = $("#edit-modal");
    const editBtn = byTestId("test-todo-edit-button");
    const closeBtn = $("#edit-modal-close");
    const cancelBtn = $("#edit-cancel");
    const saveBtn = $("#edit-save");

    const titleEl = byTestId("test-todo-title");
    const descEl = byTestId("test-todo-description");

    const inputTitle = $("#edit-title");
    const inputDesc = $("#edit-description");
    const inputPriority = $("#edit-priority");
    const inputStatus = $("#edit-status");

    initOverlayClose(modal);

    editBtn.addEventListener("click", () => {
      inputTitle.value = titleEl.textContent.trim();
      inputDesc.value = descEl.textContent.trim();
      openModal(modal, "edit-title");
    });

    closeBtn.addEventListener("click", () => closeModal(modal));
    cancelBtn.addEventListener("click", () => closeModal(modal));

    saveBtn.addEventListener("click", () => {
      const newTitle = inputTitle.value.trim();
      const newDesc = inputDesc.value.trim();
      const newPriority = inputPriority.value;
      const newStatus = inputStatus.value;

      if (!newTitle) {
        inputTitle.setCustomValidity("Title cannot be empty");
        inputTitle.reportValidity();
        return;
      }
      inputTitle.setCustomValidity("");

      titleEl.textContent = newTitle;
      descEl.textContent = newDesc;

      const deleteName = document.getElementById("delete-task-name");
      if (deleteName) deleteName.textContent = `"${newTitle}"`;

      applyPriority(newPriority);
      applyStatus(newStatus);
      syncCheckboxState(newStatus === "done");

      closeModal(modal);
    });
  }

  // components/deleteModal.ts

  const FADE_DURATION_MS = 400;
  const RESTORE_DELAY_MS = 1_500;

  function initDeleteModal() {
    const modal = $("#delete-modal");
    const deleteBtn = byTestId("test-todo-delete-button");
    const closeBtn = $("#delete-modal-close");
    const cancelBtn = $("#delete-cancel");
    const confirmBtn = $("#delete-confirm");

    initOverlayClose(modal);

    deleteBtn.addEventListener("click", () => {
      openModal(modal, "delete-cancel");
    });

    closeBtn.addEventListener("click", () => closeModal(modal));
    cancelBtn.addEventListener("click", () => closeModal(modal));

    confirmBtn.addEventListener("click", () => {
      closeModal(modal);

      const card = byTestId("test-todo-card");
      card.style.transition = `opacity ${FADE_DURATION_MS}ms ease, transform ${FADE_DURATION_MS}ms ease`;
      card.style.opacity = "0";
      card.style.transform = "scale(0.96)";

      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "";
      }, RESTORE_DELAY_MS);
    });
  }

  // main.ts

  function init() {
    updateTimeRemaining();
    initCheckbox();
    initEditModal();
    initDeleteModal();

    // REFRESH_S is in seconds — convert to ms for setInterval
    setInterval(updateTimeRemaining, REFRESH_S * 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})(); // end IIFE
