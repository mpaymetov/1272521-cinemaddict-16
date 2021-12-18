import FilmListView from '../view/film-list-view';
import {remove, render, RenderPosition} from '../utils/render';
import {updateItem} from '../utils/common';
import {FILM_COUNT_PER_STEP, LIST_EXTRA_FILM_COUNT} from '../const';
import MoreButtonView from '../view/more-button-view';
import FilmCardPresenter from './film-card-presenter';

export default class FilmListPresenter {
  #popupComponent = null;
  #filmBlockElement = null;
  #filmListTitle = null;
  #isFilmListExtra = null;
  #filmListElement = null;
  #filmListContainer = null;
  #filmCountPerStep = null;
  #renderedFilmCount = null;
  #moreButtonComponent = new MoreButtonView();

  #changeData = null;

  #films = [];
  #filmPresenter = new Map();

  constructor(filmBlockElement, popupComponent, title, isExtra = false, changeData) {
    this.#popupComponent = popupComponent;
    this.#filmBlockElement = filmBlockElement;
    this.#filmListTitle = title;
    this.#isFilmListExtra = isExtra;
    this.#filmCountPerStep = (this.#isFilmListExtra) ? LIST_EXTRA_FILM_COUNT : FILM_COUNT_PER_STEP;
    this.#changeData = changeData;
  }

  init = (films) => {
    this.#films = films;
    this.#filmListElement = new FilmListView(this.#filmListTitle, this.#isFilmListExtra);
    this.#renderFilmList();
  }

  updateFilm = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    if (this.#filmPresenter.get(updatedFilm.id)) {
      this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
    }
  }

  #renderFilm = (film) => {
    const filmCardPresenter = new FilmCardPresenter(this.#filmListContainer, this.#popupComponent, this.#changeData);
    filmCardPresenter.init(film);
    this.#filmPresenter.set(film.id, filmCardPresenter);
  }

  #renderFilms = (from, to) => {
    this.#films
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film));
  }

  #handleMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + this.#filmCountPerStep);

    this.#renderedFilmCount += this.#filmCountPerStep;

    if (this.#renderedFilmCount >= this.#films.length) {
      remove(this.#moreButtonComponent);
    }
  }

  #renderMoreButton = () => {
    this.#renderedFilmCount = this.#filmCountPerStep;
    render(this.#filmListElement, this.#moreButtonComponent, RenderPosition.BEFOREEND);
    this.#moreButtonComponent.setClickHandler(this.#handleMoreButtonClick);
  }

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#filmCountPerStep = (this.#isFilmListExtra) ? LIST_EXTRA_FILM_COUNT : FILM_COUNT_PER_STEP;
    remove(this.#moreButtonComponent);
  }

  #renderFilmList = () => {
    render(this.#filmBlockElement, this.#filmListElement, RenderPosition.BEFOREEND);

    this.#filmListContainer = this.#filmListElement.element.querySelector('.films-list__container');
    this.#renderFilms(0, Math.min(this.#films.length, this.#filmCountPerStep));

    if (this.#films.length > this.#filmCountPerStep && !this.#isFilmListExtra) {
      this.#renderMoreButton();
    }
  }
}
