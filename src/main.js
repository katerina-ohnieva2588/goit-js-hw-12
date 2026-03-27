import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from "./js/render-functions.js";

import { getImagesByQuery } from "./js/pixabay-api.js";

const form = document.querySelector(".form");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = form.elements["search-text"];

let page = 1;
let searchText = "";

searchInput.addEventListener("input", () => {
  if (!searchInput.value.trim()) {
    hideLoadMoreButton();
    clearGallery();
  }
});

async function handleData(data) {
  const newCardsCount = createGallery(data.hits);

  page += 1;

  const totalLoaded = (page - 1) * data.hits.length + newCardsCount;
  if (totalLoaded < data.totalHits) {
    showLoadMoreButton();
  } else {
    hideLoadMoreButton();
    iziToast.info({
      message: "We're sorry, but you've reached the end of search results.",
    });
  }

  if (newCardsCount > 0) {
    const gallery = document.querySelector(".gallery");
    const firstCard = gallery.querySelector(".gallery-item");

    if (firstCard) {
      const { height: cardHeight } = firstCard.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2, 
        behavior: "smooth",
      });
    }
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  searchText = searchInput.value.trim();
  if (!searchText) {
    hideLoadMoreButton();
    clearGallery();
    return;
  }

  page = 1;
  hideLoadMoreButton();
  clearGallery();
  showLoader();

  try {
    const data = await getImagesByQuery(searchText, page);
    if (!data.hits.length) {
      iziToast.error({ message: "No images found!" });
      hideLoadMoreButton();
      return;
    }
    await handleData(data);
  } catch (err) {
    console.error(err);
    iziToast.error({ message: "Something went wrong!" });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener("click", async () => {
  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(searchText, page);
    if (!data.hits.length) {
      iziToast.info({ message: "No more images to load!" });
      return;
    }
    await handleData(data);
  } catch (err) {
    console.error(err);
    iziToast.error({ message: "Something went wrong!" });
  } finally {
    hideLoader();
  }
});
