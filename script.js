const portfolioGrid = document.getElementById("portfolio-grid");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const yearNode = document.getElementById("year");

function canLoadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = src;
  });
}

function openLightbox(item) {
  lightboxImage.src = item.image;
  lightboxImage.alt = item.title;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.style.overflow = "";
}

function buildCard(item) {
  const card = document.createElement("button");
  const media = document.createElement("div");
  const image = document.createElement("img");
  const body = document.createElement("div");
  const title = document.createElement("h3");

  card.type = "button";
  card.className = "portfolio-card";
  card.setAttribute("aria-label", `Open image for ${item.title}`);

  media.className = "portfolio-card__media";
  image.src = item.image;
  image.alt = item.title;
  image.loading = "lazy";

  body.className = "portfolio-card__body";
  title.className = "portfolio-card__title";
  title.textContent = item.title;

  media.appendChild(image);
  body.appendChild(title);
  card.append(media, body);
  card.addEventListener("click", () => openLightbox(item));

  return card;
}

async function loadPortfolio() {
  try {
    const response = await fetch("portfolio.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const items = await response.json();
    const checks = await Promise.all(
      items.map(async (item) => ((await canLoadImage(item.image)) ? item : null))
    );
    const validItems = checks.filter(Boolean);

    portfolioGrid.replaceChildren();

    if (!validItems.length) {
      portfolioGrid.innerHTML = '<p class="portfolio-status">Portfolio items could not be loaded.</p>';
      return;
    }

    validItems.forEach((item) => {
      portfolioGrid.appendChild(buildCard(item));
    });
  } catch (error) {
    portfolioGrid.innerHTML = '<p class="portfolio-status">Portfolio items could not be loaded.</p>';
    console.error(error);
  }
}

document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
document.getElementById("lightbox-dismiss").addEventListener("click", closeLightbox);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) {
    closeLightbox();
  }
});

yearNode.textContent = new Date().getFullYear();
loadPortfolio();
