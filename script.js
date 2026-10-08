async function loadMedia() {
  const response = await fetch("data/media.json");
  const media = await response.json();

  // If we're on an individual media page, load that page instead
  if (document.getElementById("media-detail")) {
    loadMediaDetail(media);
    return;
  }

  renderHomepage(media);
}


// =========================
// HOMEPAGE
// =========================

function renderHomepage(media) {

  // Featured
  const featured = media.find(item => item.featured);

  if (featured) {
    const featuredContainer =
      document.getElementById("featured-container");

    featuredContainer.innerHTML = `
      <a
        href="media.html?id=${encodeURIComponent(featured.id)}"
        class="featured-card"
      >

        <div class="featured-art">
          ${
            featured.metadata.image
              ? `<img
                  src="${escapeHTML(featured.metadata.image)}"
                  alt="${escapeHTML(featured.title)} poster"
                >`
              : `<span>${escapeHTML(featured.type)}</span>`
          }
        </div>

        <div class="featured-content">

          <p class="eyebrow">
            ${escapeHTML(featured.type)}
          </p>

          <h3>
            ${escapeHTML(featured.title)}
          </h3>

          <div class="rating">
            ${escapeHTML(featured.personal.rating)}
          </div>

          <p>
            ${escapeHTML(featured.personal.description)}
          </p>

        </div>

      </a>
    `;
  }


  // Recently Finished
  const recentlyFinished = media
    .filter(item => item.personal.status === "Completed")
    .sort(
      (a, b) =>
        (b.personal.rating || 0) -
        (a.personal.rating || 0)
    );

  const recentlyGrid =
    document.getElementById("recently-grid");

  recentlyGrid.innerHTML = recentlyFinished
    .map(item => createMediaCard(item))
    .join("");


  // Top Rated
  const topRated = [...media]
    .filter(item => item.personal.rating != null)
    .sort(
      (a, b) =>
        b.personal.rating - a.personal.rating
    )
    .slice(0, 5);

  const topRatedList =
    document.getElementById("top-rated-list");

  topRatedList.innerHTML = topRated
    .map(
      (item, index) => `
        <a
          href="media.html?id=${encodeURIComponent(item.id)}"
          class="top-rated-item"
        >

          <span class="top-rated-number">
            ${index + 1}
          </span>

          <span class="top-rated-title">
            ${escapeHTML(item.title)}
          </span>

          <span class="top-rated-type">
            ${escapeHTML(item.type)}
          </span>

          <span class="top-rated-rating">
            ${escapeHTML(item.personal.rating)}
          </span>

        </a>
      `
    )
    .join("");
}


// =========================
// MEDIA CARD
// =========================

function createMediaCard(item) {
  return `
    <a
      href="media.html?id=${encodeURIComponent(item.id)}"
      class="media-card"
    >

      <div class="media-placeholder">

        ${
          item.metadata.image
            ? `<img
                src="${escapeHTML(item.metadata.image)}"
                alt="${escapeHTML(item.title)} poster"
              >`
            : `<span>${escapeHTML(item.type)}</span>`
        }

      </div>

      <div class="media-card-content">

        <div class="media-card-header">

          <h3>
            ${escapeHTML(item.title)}
          </h3>

          <span class="media-rating">
            ${escapeHTML(item.personal.rating)}
          </span>

        </div>

        <p class="media-type">
          ${escapeHTML(item.type)}
        </p>

      </div>

    </a>
  `;
}


// =========================
// INDIVIDUAL MEDIA PAGE
// =========================

function loadMediaDetail(media) {

  const params = new URLSearchParams(
    window.location.search
  );

  const id = params.get("id");

  const item = media.find(
    mediaItem => mediaItem.id === id
  );

  const container =
    document.getElementById("media-detail");


  // Media doesn't exist
  if (!item) {

    container.innerHTML = `
      <div class="media-not-found">

        <p class="eyebrow">
          Nothing here
        </p>

        <h1>
          Media not found.
        </h1>

        <p>
          I couldn't find that piece of media in the archive.
        </p>

      </div>
    `;

    return;
  }


  // Media exists
  container.innerHTML = `

    <div class="media-detail">

      <div class="media-detail-art">

        ${
          item.metadata.image
            ? `<img
                src="${escapeHTML(item.metadata.image)}"
                alt="${escapeHTML(item.title)} poster"
              >`
            : `<div class="media-detail-placeholder">
                ${escapeHTML(item.type)}
              </div>`
        }

      </div>


      <div class="media-detail-content">

        <p class="eyebrow">
          ${escapeHTML(item.type)}
        </p>

        <h1>
          ${escapeHTML(item.title)}
        </h1>

        <div class="media-detail-meta">

          ${
            item.metadata.year
              ? `<span>${escapeHTML(item.metadata.year)}</span>`
              : ""
          }

          ${
            item.personal.service
              ? `<span>${escapeHTML(item.personal.service)}</span>`
              : ""
          }

          ${
            item.personal.status
              ? `<span>${escapeHTML(item.personal.status)}</span>`
              : ""
          }

        </div>


        ${
          item.personal.rating != null
            ? `
              <div class="media-detail-rating">
                ${escapeHTML(item.personal.rating)}
              </div>
            `
            : ""
        }


        ${
          item.personal.recommendation
            ? `
              <p class="media-detail-recommendation">
                ${escapeHTML(item.personal.recommendation)}
              </p>
            `
            : ""
        }


        ${
          item.personal.description
            ? `
              <div class="media-detail-section-block">

                <p class="eyebrow">
                  In My Words
                </p>

                <p>
                  ${escapeHTML(item.personal.description)}
                </p>

              </div>
            `
            : ""
        }


        ${
          item.personal.themes &&
          item.personal.themes.length
            ? `
              <div class="media-detail-section-block">

                <p class="eyebrow">
                  Themes
                </p>

                <div class="media-tags">

                  ${item.personal.themes
                    .map(
                      theme =>
                        `<span>${escapeHTML(theme)}</span>`
                    )
                    .join("")}

                </div>

              </div>
            `
            : ""
        }

      </div>

    </div>

  `;


  // Update browser title
  document.title =
    `${item.title} | Dom's Media Archive`;
}


// =========================
// HTML SAFETY
// =========================

function escapeHTML(value) {

  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// =========================
// START
// =========================

loadMedia();
