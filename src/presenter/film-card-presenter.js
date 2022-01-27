import FilmCardView from '../view/film-card-view';
import {remove, render, replace, RenderPosition} from '../utils/render';
import {UserAction, UpdateType} from '../const';
import dayjs from 'dayjs';

export default class FilmCardPresenter {
  #popupComponent = null;
  #film = null;
  #filmContainer = null;
  #filmCardComponent = null;
  #changeData = null;

  constructor(filmContainer, popupComponent, changeData) {
    this.#filmContainer = filmContainer;
    this.#popupComponent = popupComponent;
    this.#changeData = changeData;
  }

  init = (film) => {
    this.#film = film;
    const prevFilmCardComponent = this.#filmCardComponent;
    this.#filmCardComponent = new FilmCardView(this.#film);

    this.#filmCardComponent.setWatchlistAddedClickHandler(this.#handleWatchlistAddedClick);
    this.#filmCardComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFilmCardComponent === null) {
      render(this.#filmContainer, this.#filmCardComponent, RenderPosition.BEFOREEND);
    } else if (this.#filmContainer.contains(prevFilmCardComponent.element)) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
      remove(prevFilmCardComponent);
    }

    this.#filmCardComponent.setClickHandler(() => {
      this.#popupComponent.init(this.#film);
    });
  }

  #handleWatchlistAddedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, isAddedToWatchList: !this.#film.isAddedToWatchList}
    );
  }

  #handleWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, isWatched: !this.#film.isWatched, watchingDate: dayjs()}
    );
  }

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, isFavorite: !this.#film.isFavorite}
    );
  }

  destroy = () => {
    remove(this.#filmCardComponent);
  }
}
