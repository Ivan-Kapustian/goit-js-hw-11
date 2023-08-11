import { PixabayAPI } from './pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkup } from './markup';

const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const pixabayAPI = new PixabayAPI();
const target = document.querySelector('.js-guard');
const simplelightbox = new SimpleLightbox('.gallery a', {});

const options = {
  root: null,
  rootMargin: '400px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(handleIntersect, options);
searchForm.addEventListener('submit', handlerSearchForm);
let currentPage = 1;
function handlerSearchForm(evt) {
  evt.preventDefault();
  target.hidden = true;
  gallery.innerHTML = '';
  const searchQuery = evt.currentTarget.elements['searchQuery'].value.trim();
  pixabayAPI.q = searchQuery;
  pixabayAPI.page = 1;
  currentPage = 1;
  searchPhotos();
}

async function searchPhotos() {
  try {
    const { data } = await pixabayAPI.fetchPhotos();
    if (data.hits.length < 1) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
    target.hidden = false;
    observer.observe(target);
    simplelightbox.refresh();
  } catch (error) {
    console.log(error);
  }
}

function handleIntersect(evt) {
  pixabayAPI.page += 1;
  if (evt[0].isIntersecting) {
    searchMorePhotos();
  }
}

async function searchMorePhotos() {
  try {
    const { data } = await pixabayAPI.fetchPhotos(currentPage);
    gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
    currentPage++;
    if (currentPage >= data.totalHits) {
      observer.unobserve(target);
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }
    simplelightbox.refresh();
  } catch (error) {}
}
