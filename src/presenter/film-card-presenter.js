import FilmCardView from '../view/film-card-view';
import {remove, render, replace, RenderPosition} from '../utils/render';

export default class FilmCardPresenter {
  #popupComponent = null;
  #film = null;
  #filmContainer = null;
  #filmCardComponent = null;

  constructor(filmContainer, popupComponent) {
    this.#filmContainer = filmContainer;
    this.#popupComponent = popupComponent;
  }

  init = (film) => {
    this.#film = film;
    const prevFilmCardComponent = this.#filmCardComponent;
    this.#filmCardComponent = new FilmCardView(this.#film);

    if (prevFilmCardComponent === null) {
      render(this.#filmContainer, this.#filmCardComponent, RenderPosition.BEFOREEND);

      this.#filmCardComponent.setClickHandler(() => {
        this.#popupComponent.init(this.#film);
      });

      return;
    }

    if (this.#filmCardComponent.element.contains(prevFilmCardComponent.element)) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  }

  #destroy = () => {
    remove(this.#filmCardComponent);
  }
}
