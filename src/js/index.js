import '../css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const Lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});
Notiflix.Notify.init({ width: '450px' });

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const btnSearchEl = document.querySelector('.search-button');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.style.display="none";

const BASE_URL = 'https://pixabay.com/api/';
const API = '30756171-35a1e9813d8b92c3e50636358';

let q = '';
let page = 1;

const fetchPhotos = async (page, q) => {
  const params = new URLSearchParams({
    key: API,
    page,
    per_page: 40,
    q,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });
  {
    const response = await axios.get(`${BASE_URL}?${params}`);
    const photos = response;
    if (photos.status !== 200) {
      throw new Error('photos.status');
    }
    return photos.data;
  }
};

form.addEventListener('submit', event => {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  loadMoreBtn.style.display="none";
  q = event.target.elements.searchQuery.value.trim();
  if (q !== '') {
    fetchPhotos(page, q)
      .then(data => {
        if (data.hits.length === 0) {
          Notiflix.Notify.init({ width: '550px', position: 'center-center' });
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else {
          renderPhotos(data.hits);
          Notiflix.Notify.init({ width: '550px', position: 'right-top' });
          Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
          loadMoreBtn.style.display="block";
          Lightbox.refresh();
          form.reset();
        }
      })
      .catch(error => console.log(error.message));
  }
});

function renderPhotos(photos) {
  console.log(photos);
  const markup = photos
    .map(photo => {
      return `<div class="photo-card"><a href="${photo.largeImageURL}">
  <img src="${photo.webformatURL}" alt="${photo.tags}" width="300" height="200"loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: <br> ${photo.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: <br> ${photo.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: <br> ${photo.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: <br> ${photo.downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

loadMoreBtn.addEventListener('click', () => {
  page += 1;
  fetchPhotos(page, q).then(data => {
    if (data.hits.length === 0) {
        loadMoreBtn.style.display="none";
      Notiflix.Notify.init({
        width: '450px',
        position: 'right-bottom',
      });
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
    renderPhotos(data.hits);
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    Lightbox.refresh();
  });
});
