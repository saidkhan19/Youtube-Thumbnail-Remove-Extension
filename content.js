const IMAGE_LINK =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/YouTube_2024_%28Print%29.svg/1024px-YouTube_2024_%28Print%29.svg.png";

function processThumbnail(thumb) {
  // This runs during idle time
  requestIdleCallback(() => {
    thumb.src = IMAGE_LINK;

    io.unobserve(thumb);
  });
}

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        processThumbnail(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
  }
);

function handleNewThumbnails() {
  const thumbnails = [
    ...document.querySelectorAll("ytd-thumbnail img"),
    ...document.querySelectorAll("yt-thumbnail-view-model img"),
  ];

  thumbnails.forEach((thumb) => {
    io.observe(thumb);
  });
}

const mo = new MutationObserver(() => {
  handleNewThumbnails();
});

function startWatching() {
  mo.observe(document.body, {
    childList: true,
    subtree: true,
  });

  handleNewThumbnails(); // run initially
}

if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  startWatching();
} else {
  window.addEventListener("load", startWatching);
}
