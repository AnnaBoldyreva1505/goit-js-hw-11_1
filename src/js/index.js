import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import renderPhotos from './renderPhotos';
import fetchPhotos from './fetchPhotos';

const Lightbox = new SimpleLightbox('.gallery a', {
  captionPosition: 'bottom',
  captionsData: 'alt',
  captionDelay: 250,
});
Notiflix.Notify.init({ width: '450px' });

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.style.display = 'none';

let q = '';
let page = 1;

const searchRequest = event => {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  loadMoreBtn.style.display = 'none';
  q = event.target.elements.searchQuery.value.trim();
  if (q !== '') {
    fetchPhotos(page, q)
      .then(data => {
        if (data.hits.length === 0) {
          Notiflix.Notify.init({ width: '550px', position: 'right-top' });
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else {
          renderPhotos(data.hits);
          Notiflix.Notify.init({ width: '550px', position: 'right-top' });
          Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
          loadMoreBtn.style.display = 'block';
          Lightbox.refresh();
          form.reset();
        }
      })
      .catch(error => console.log(error.message));
  }
};

const loadMore = () => {
  page += 1;
  fetchPhotos(page, q).then(data => {
    if (data.hits.length === 0) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.init({
        width: '450px',
        position: 'right-top',
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
};

form.addEventListener('submit', searchRequest);
loadMoreBtn.addEventListener('click', loadMore);
