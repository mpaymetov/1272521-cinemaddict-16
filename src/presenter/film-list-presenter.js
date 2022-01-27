import FilmListView from '../view/film-list-view';
import MoreButtonView from '../view/more-button-view';
import FilmCardPresenter from './film-card-presenter';
import {remove, render, RenderPosition} from '../utils/render';
import {FILM_COUNT_PER_STEP, LIST_EXTRA_FILM_COUNT, SortType} from '../const';
import {sortDate, sortRating, sortComment} from '../utils/film';
import {filter} from '../utils/filter';

export default class FilmListPresenter {
  #filmsModel = null;
  #filterModel = null;
  #popupComponent = null;
  #filmBlockElement = null;
  #filmListTitle = null;
  #isFilmListExtra = null;
  #filmListElement = null;
  #filmListContainer = null;
  #filmCountPerStep = null;
  #renderedFilmCount = null;
  #moreButtonComponent = null;

  #changeData = null;
  #filmPresenter = new Map();
  #filmsSortType = null;

  constructor(filmBlockElement, popupComponent, title, isExtra = false, changeData, filmsSortType, filmsModel, filterModel) {
    this.#popupComponent = popupComponent;
    this.#filmBlockElement = filmBlockElement;
    this.#filmListTitle = title;
    this.#isFilmListExtra = isExtra;
    this.#filmCountPerStep = (this.#isFilmListExtra) ? LIST_EXTRA_FILM_COUNT : FILM_COUNT_PER_STEP;
    this.#changeData = changeData;
    this.#filmsSortType = filmsSortType;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
  }

  get films() {
    const filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[filterType](films);

    switch (this.#filmsSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortDate);
      case SortType.RATING:
        return filteredFilms.sort(sortRating);
      case SortType.COMMENT:
        return filteredFilms.sort(sortComment);
    }

    return filteredFilms;
  }

  init = () => {
    this.#filmListElement = new FilmListView(this.#filmListTitle, this.#isFilmListExtra);
    render(this.#filmBlockElement, this.#filmListElement, RenderPosition.BEFOREEND);

    this.#renderFilmList();
  }

  updateFilm = (updatedFilm) => {
    if (this.#filmPresenter.get(updatedFilm.id)) {
      this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
    }
  }

  changeSortType = (sortType) => {
    if (this.#filmsSortType === sortType) {
      return;
    }

    this.#filmsSortType = sortType;
  }

  #renderFilm = (film) => {
    const filmCardPresenter = new FilmCardPresenter(this.#filmListContainer, this.#popupComponent, this.#changeData);
    filmCardPresenter.init(film);
    this.#filmPresenter.set(film.id, filmCardPresenter);
  }

  #renderFilms = (from, to) => {
    this.films
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film));
  }

  #handleMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + this.#filmCountPerStep);
    this.#renderedFilmCount += this.#filmCountPerStep;

    if (this.#renderedFilmCount >= this.films.length) {
      remove(this.#moreButtonComponent);
    }
  }

  #renderMoreButton = () => {
    this.#renderedFilmCount = this.#filmCountPerStep;
    this.#moreButtonComponent = new MoreButtonView();
    render(this.#filmListElement, this.#moreButtonComponent, RenderPosition.BEFOREEND);
    this.#moreButtonComponent.setClickHandler(this.#handleMoreButtonClick);
  }

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#filmCountPerStep = (this.#isFilmListExtra) ? LIST_EXTRA_FILM_COUNT : FILM_COUNT_PER_STEP;
    remove(this.#moreButtonComponent);
  }

  destroy = () => {
    this.#clearFilmList();
    remove(this.#filmListElement);
  }

  #renderFilmList = () => {
    this.#filmListContainer = this.#filmListElement.element.querySelector('.films-list__container');
    this.#renderFilms(0, Math.min(this.films.length, this.#filmCountPerStep));

    if (this.films.length > this.#filmCountPerStep && !this.#isFilmListExtra) {
      this.#renderMoreButton();
    }
  }
}
