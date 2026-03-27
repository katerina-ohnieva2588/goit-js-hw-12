import SimpleLightboxModule from "simplelightbox";
const SimpleLightbox = SimpleLightboxModule.default || SimpleLightboxModule;
import "simplelightbox/dist/simple-lightbox.min.css";

const gallery = document.querySelector(".gallery");
const loader = document.querySelector(".loader");
const loadMoreBtn = document.querySelector(".load-more");

export let lightbox;

export function showLoadMoreButton() {
  loadMoreBtn.classList.add("active"); 
}

export function hideLoadMoreButton() {
  loadMoreBtn.classList.remove("active");
}

export function clearGallery() {
  gallery.innerHTML = "";
}

export function showLoader() {
  loader.classList.add("active");
}

export function hideLoader() {
  loader.classList.remove("active");
}

export function createGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <li class="gallery-item">
        <a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><span class="label">Likes:</span> <span class="value">${likes}</span></p>
          <p class="info-item"><span class="label">Views:</span> <span class="value">${views}</span></p>
          <p class="info-item"><span class="label">Comments:</span> <span class="value">${comments}</span></p>
          <p class="info-item"><span class="label">Downloads:</span> <span class="value">${downloads}</span></p>
        </div>
      </li>
    `
    )
    .join("");

  gallery.insertAdjacentHTML("beforeend", markup);

  if (!lightbox) {
    lightbox = new SimpleLightbox(".gallery a", {
      captionsData: "alt",
      captionDelay: 250,
      showCounter: true,
      nav: true,
      close: true,
      overlay: true,
    });
  } else {
    lightbox.refresh();
  }

  return images.length;
}


export function scrollGallery(newCardsCount) {
  const galleryItems = gallery.querySelectorAll(".gallery-item");
  if (!galleryItems.length) return;

  const newCard = galleryItems[galleryItems.length - newCardsCount];
  if (newCard) {
    const cardHeight = newCard.getBoundingClientRect().height;
    window.scrollBy({ top: cardHeight * 2, behavior: "smooth" });
  }
}