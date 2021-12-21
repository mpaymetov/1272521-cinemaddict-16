import SortView from '../view/sort-view';
import FilmBlockView from '../view/film-block-view';
import NoFilmView from '../view/no-film-view.js';
import {render, RenderPosition} from '../utils/render';
import FilmListPresenter from './film-list-presenter';
import PopupPresenter from './popup-presenter';
import {updateItem} from '../utils/common';
import {SortType} from '../const';

export default class FilmBlockPresenter {
  #popupComponent = null;
  #blockContainer = null;

  #sortComponent = new SortView();
  #noFilmComponent = new NoFilmView();
  #filmBlockElement = new FilmBlockView();

  #mainFilmList = null;
  #topRatedFilmList = null;
  #mostCommentedFilmList = null;

  #mainListSortType = SortType.DEFAULT;

  #films = [];

  constructor(popupContainer, blockContainer) {
    this.#blockContainer = blockContainer;
    this.#popupComponent = new PopupPresenter(popupContainer, this.#handleFilmChange);

    render(this.#blockContainer, this.#filmBlockElement, RenderPosition.BEFOREEND);

    this.#mainFilmList = new FilmListPresenter(this.#filmBlockElement, this.#popupComponent, 'All movies. Upcoming', false, this.#handleFilmChange, this.#mainListSortType);
    this.#topRatedFilmList = new FilmListPresenter(this.#filmBlockElement, this.#popupComponent, 'Top rated', true, this.#handleFilmChange, SortType.RATING);
    this.#mostCommentedFilmList = new FilmListPresenter(this.#filmBlockElement, this.#popupComponent, 'Most commented', true, this.#handleFilmChange, SortType.COMMENT);
  }

  init = (films) => {
    this.#films = [...films];

    this.#renderFilmBoard();
  }

  #handleSortTypeChange = (sortType) => {
    this.#mainListSortType = sortType;
    this.#mainFilmList.changeSortType(sortType);
  }

  #renderSort = () => {
    render(this.#filmBlockElement, this.#sortComponent, RenderPosition.BEFOREBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderNoFilms = () => {
    render(this.#blockContainer, this.#noFilmComponent, RenderPosition.BEFOREEND);
  }

  #handleFilmChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    if (this.#popupComponent.isShow() && (updatedFilm.id === this.#popupComponent.getId())) {
      this.#popupComponent.init(updatedFilm);
    }
    this.#mainFilmList.updateFilm(updatedFilm);
    this.#topRatedFilmList.updateFilm(updatedFilm);
    this.#mostCommentedFilmList.updateFilm(updatedFilm);
  }

  #renderFilmBoard = () => {
    if (this.#films.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();

    this.#mainFilmList.init(this.#films);
    this.#topRatedFilmList.init(this.#films);
    this.#mostCommentedFilmList.init(this.#films);
  }
}
