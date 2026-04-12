import { updateTimeRemaining, REFRESH_S } from "./components/timeRemaining";
import { initCheckbox } from "./components/checkbox";
import { initEditModal } from "./components/editModal";
import { initDeleteModal } from "./components/deleteModal";
function init() {
    updateTimeRemaining();
    initCheckbox();
    initEditModal();
    initDeleteModal();
    setInterval(updateTimeRemaining, REFRESH_S);
}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
}
else {
    init();
}
