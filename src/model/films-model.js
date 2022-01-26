import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../const.js';

export default class FilmsModel extends AbstractObservable {
  #apiService = null;
  #films = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#apiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch(err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  };

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#apiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, updatedFilm);
    } catch(err) {
      throw new Error('Can\'t update film');
    }
  };

  #adaptToClient = (film) => {
    const adaptedFilm = {...film,
      actors: film['film_info']['actors'],
      ageRating: film['film_info']['age_rating'],
      totalRating: film['film_info']['total_rating'],
      title: film['film_info']['title'],
      originalTitle: film['film_info']['alternative_title'],
      description: film['film_info']['description'],
      director: film['film_info']['director'],
      genres: film['film_info']['genre'],
      poster: film['film_info']['poster'],
      writers: film['film_info']['writers'],
      duration: film['film_info']['runtime'],
      release: film['film_info']['release']['date'],
      country: film['film_info']['release']['release_country'],

      isAddedToWatchList: film['user_details']['watchlist'],
      isFavorite: film['user_details']['favorite'],
      isWatched: film['user_details']['already_watched'],
      watchingDate: film['user_details']['watching_date'],
    };

    delete adaptedFilm['user_details'];
    delete adaptedFilm['film_info'];

    return adaptedFilm;
  }
}
