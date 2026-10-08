async function loadMedia() {
  try {
    const response = await fetch("data/media.json");

    if (!response.ok) {
      throw new Error("Could not load media data.");
    }

    const media = await response.json();

    renderFeatured(media);
    renderRecently(media);
    renderTopRated(media);

  } catch (error) {
    console.error("Error loading media:", error);
  }
}


function renderFeatured(media) {
  const container = document.getElementById("featured-container");

  if (!container) return;

  const featured = media.find(item => item.featured === true);

  if (!featured) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <div class="featured-card">
      <div class="featured-art">
    ${
    featured.metadata.image
      ? `<img src="${escapeHTML(featured.metadata.image)}" alt="${escapeHTML(featured.title)} poster">`
      : `<span>${escapeHTML(featured.type)}</span>`
    }
      </div>

      <div class="featured-content">
        <p class="eyebrow">Featured</p>

        <h3>${escapeHTML(featured.title)}</h3>

        <div class="featured-meta">
          <span class="rating">${featured.personal.rating}</span>
          <span>${escapeHTML(featured.type)}</span>
          <span>${escapeHTML(featured.personal.service)}</span>
        </div>

        <p>${escapeHTML(featured.personal.description)}</p>

        <span class="recommendation">
          ${escapeHTML(featured.personal.recommendation)}
        </span>
      </div>
    </div>
  `;
}


function renderRecently(media) {
  const container = document.getElementById("recently-grid");

  if (!container) return;

  const recentlyFinished = media
    .filter(item => item.personal.status === "Completed")
    .sort((a, b) => b.personal.rating - a.personal.rating)
    .slice(0, 3);

  container.innerHTML = recentlyFinished
    .map(item => createMediaCard(item))
    .join("");
}


function renderTopRated(media) {
  const container = document.getElementById("top-rated-list");

  if (!container) return;

  const topRated = media
    .filter(item => typeof item.personal.rating === "number")
    .sort((a, b) => b.personal.rating - a.personal.rating)
    .slice(0, 5);

  container.innerHTML = topRated
    .map((item, index) => `
      <div class="top-rated-item">
        <span class="rank">${index + 1}</span>

        <div class="top-rated-info">
          <h3>${escapeHTML(item.title)}</h3>
          <span>
            ${escapeHTML(item.type)} ·
            ${escapeHTML(item.personal.service)}
          </span>
        </div>

        <span class="top-rated-score">
          ${item.personal.rating}
        </span>
      </div>
    `)
    .join("");
}


function createMediaCard(item) {
  return `
    <article class="media-card">

      <div class="media-placeholder">
        ${
          item.metadata.image
            ? `<img src="${escapeHTML(item.metadata.image)}" alt="${escapeHTML(item.title)} poster">`
            : `<span>${escapeHTML(item.type)}</span>`
          }
      </div>

      <div class="media-card-content">
        <h3>${escapeHTML(item.title)}</h3>

        <div class="media-meta">
          <span class="rating">${item.personal.rating}</span>
          <span>${escapeHTML(item.personal.service)}</span>
        </div>

        <p>${escapeHTML(item.personal.description)}</p>
      </div>

    </article>
  `;
}


function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


loadMedia();
