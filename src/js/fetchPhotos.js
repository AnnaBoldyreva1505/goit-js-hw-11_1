import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API = '14239803-1525d40278084147650a3f538';

export const fetchPhotos = async (page, q) => {
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

  export default fetchPhotos