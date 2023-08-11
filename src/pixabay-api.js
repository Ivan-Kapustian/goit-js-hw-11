import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '38759536-0e0cff3eb22d5dc7d07989c9c';
  q = null;
  page = 1;
  async fetchPhotos(page) {
    const searchParams = new URLSearchParams({
      key: this.#API_KEY,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      q: this.q,
      page: page,
    });
    return await axios.get(`${this.#BASE_URL}?${searchParams}`);
  }
}
