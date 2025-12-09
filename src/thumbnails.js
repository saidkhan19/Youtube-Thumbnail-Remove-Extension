import { getRandomInt } from "./utils";

// Set a random image at load
const IMAGE_LINK = chrome.runtime.getURL(
  `images/thumbnail_${getRandomInt(1, 5)}.jpg`
);

// Youtube dynamically changes 'src' attribute
// prevent changes with an attribute mutation observer
const srcObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "attributes" && mutation.attributeName === "src") {
      const img = mutation.target;
      if (img.src !== IMAGE_LINK) {
        img.src = IMAGE_LINK;
        img.srcset = "";
      }
    }
  });
});

export function hasThumbnails() {
  // Just check if there is a thumbnail without removed attribute
  // Too cumbersome and unreliable to check mutation entries
  const searchThumb = document.querySelector(
    "ytd-thumbnail img:not([data-thumbnail-removed])"
  );
  const mainPageThumb = document.querySelector(
    "yt-thumbnail-view-model img:not([data-thumbnail-removed])"
  );

  return Boolean(searchThumb || mainPageThumb);
}

export function hasEndscreenThumbnails() {
  const endScreenThumb = document.querySelector(
    ".ytp-modern-videowall-still-image:not([data-thumbnail-removed])"
  );

  return Boolean(endScreenThumb);
}

export function hasShorts() {
  const sidePanelShorts = document.querySelector(
    "ytd-reel-shelf-renderer:not([data-element-hidden])"
  );
  const mainPageShorts = document.querySelector(
    "ytd-rich-shelf-renderer:not([data-element-hidden])"
  );

  return Boolean(sidePanelShorts || mainPageShorts);
}

export function handleThumbnails() {
  const thumbnails = [
    ...document.querySelectorAll(
      "ytd-thumbnail img:not([data-thumbnail-removed])"
    ),
    ...document.querySelectorAll(
      "yt-thumbnail-view-model img:not([data-thumbnail-removed])"
    ),
  ];

  thumbnails.forEach((thumb) => processThumbnail(thumb));
}

export function handleEndscreenThumbnails() {
  const thumbnails = [
    ...document.querySelectorAll(
      ".ytp-modern-videowall-still-image:not([data-thumbnail-removed])"
    ),
  ];

  thumbnails.forEach((thumb) => processEndscreenThumbnail(thumb));
}

export function handleRemoveShorts() {
  const shortsSections = [
    ...document.querySelectorAll(
      "ytd-reel-shelf-renderer:not([data-element-hidden])"
    ),
    ...document.querySelectorAll(
      "ytd-rich-shelf-renderer:not([data-element-hidden])"
    ),
  ];

  shortsSections.forEach((section) => hideElement(section));
}

function processThumbnail(thumb) {
  // Change thumbnail image source
  thumb.src = IMAGE_LINK;
  thumb.setAttribute("data-thumbnail-removed", "");

  // Set high zIndex on image, so that preview is hidden
  const container = thumb?.closest(".ytThumbnailViewModelImage");
  if (container) {
    container.style.zIndex = 2000;
  }

  // Setup attribute observer
  srcObserver.observe(thumb, {
    attributes: true,
    attributeFilter: ["src", "srcset"],
  });
}

function processEndscreenThumbnail(thumb) {
  // Change background image
  thumb.style.backgroundImage = `url("${IMAGE_LINK}")`;
  thumb.setAttribute("data-thumbnail-removed", "");
}

function hideElement(element) {
  element.style.display = "none";
  element.setAttribute("data-element-hidden", "");
}
