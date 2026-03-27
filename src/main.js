import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
  scrollGallery,
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

async function handleData(data, isNewSearch = false) {
  if (isNewSearch) clearGallery();

  const newCardsCount = createGallery(data.hits);

  const totalLoaded = (page - 1) * 15 + newCardsCount;

  if (totalLoaded < data.totalHits) {
    showLoadMoreButton();
  } else {
    hideLoadMoreButton();
    iziToast.info({
      message: "We're sorry, but you've reached the end of search results.",
    });
  }

  page += 1;

  if (!isNewSearch) scrollGallery(newCardsCount);
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
  showLoader();

  try {
    const data = await getImagesByQuery(searchText, page);
    if (!data.hits.length) {
      iziToast.error({ message: "No images found!" });
      hideLoadMoreButton();
      return;
    }
    await handleData(data, true);
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
    await handleData(data, false);
  } catch (err) {
    console.error(err);
    iziToast.error({ message: "Something went wrong!" });
  } finally {
    hideLoader();
  }
});