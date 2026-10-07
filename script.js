async function loadMedia() {
  try {
    const response = await fetch("data/media.json");

    if (!response.ok) {
      throw new Error("Could not load media data.");
    }

    const media = await response.json();

    renderCurrently(media);
    renderRecently(media);
    renderTopRated(media);

  } catch (error) {
    console.error("Error loading media:", error);
  }
}


/* -----------------------------
   CURRENTLY CONSUMING
----------------------------- */

function renderCurrently(media) {
  const container = document.getElementById("currently-grid");

  if (!container) return;

  const currently = media.filter(item =>
    item.status === "Currently Watching" ||
    item.status === "Rewatching"
  );

  if (currently.length === 0) {
    container.innerHTML = `
      <p class="empty-message">
        Nothing currently consuming.
      </p>
    `;
    return;
  }

  container.innerHTML = currently
    .map(item => createMediaCard(item))
    .join("");
}


/* -----------------------------
   RECENTLY FINISHED
----------------------------- */

function renderRecently(media) {
  const container = document.getElementById("recently-grid");

  if (!container) return;

  const completed = media
    .filter(item => item.status === "Completed")
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  container.innerHTML = completed
    .map(item => createMediaCard(item))
    .join("");
}


/* -----------------------------
   TOP RATED
----------------------------- */

function renderTopRated(media) {
  const container = document.getElementById("top-rated-list");

  if (!container) return;

  const topRated = [...media]
    .filter(item => typeof item.rating === "number")
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  container.innerHTML = topRated
    .map((item, index) => `
      <div class="top-rated-item">
        <span class="rank">${index + 1}</span>

        <div class="top-rated-info">
          <strong>${escapeHTML(item.title)}</strong>
          <span>${escapeHTML(item.type)} · ${escapeHTML(item.service)}</span>
        </div>

        <span class="top-rated-score">
          ${item.rating.toFixed(1)}
        </span>
      </div>
    `)
    .join("");
}


/* -----------------------------
   MEDIA CARD
----------------------------- */

function createMediaCard(item) {
  return `
    <article class="media-card">

      <div class="media-placeholder">
        <span>${escapeHTML(item.type)}</span>
      </div>

      <div class="media-card-content">

        <div class="media-card-header">
          <h3>${escapeHTML(item.title)}</h3>
          <span class="rating">${item.rating.toFixed(1)}</span>
        </div>

        <p class="media-meta">
          ${escapeHTML(item.service)}
        </p>

        <p class="media-description">
          ${escapeHTML(item.description)}
        </p>

      </div>

    </article>
  `;
}


/* -----------------------------
   SECURITY
----------------------------- */

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* -----------------------------
   START THE SITE
----------------------------- */

loadMedia();
