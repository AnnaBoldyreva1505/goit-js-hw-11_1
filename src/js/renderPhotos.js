const gallery = document.querySelector('.gallery');

export const renderPhotos = (photos) => {
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

  export default renderPhotos