import {
  handleEndscreenThumbnails,
  handleRemoveShorts,
  handleThumbnails,
  hasEndscreenThumbnails,
  hasShorts,
  hasThumbnails,
} from "./thumbnails";

function startWatching() {
  handleThumbnails();
  handleRemoveShorts();
  handleEndscreenThumbnails();

  // Setup observer for future changes
  const mo = new MutationObserver(() => {
    if (hasThumbnails()) handleThumbnails();
    if (hasEndscreenThumbnails()) handleEndscreenThumbnails();
    if (hasShorts()) handleRemoveShorts();
  });

  mo.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  startWatching();
} else {
  window.addEventListener("load", startWatching);
}
