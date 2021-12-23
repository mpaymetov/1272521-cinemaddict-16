import FilmBlockView from '../view/film-block-view';
import NoFilmView from '../view/no-film-view.js';
import {render, RenderPosition} from '../utils/render';
import FilmListPresenter from './film-list-presenter';
import PopupPresenter from './popup-presenter';
import SortPresenter from './sort-presenter';
import {updateItem} from '../utils/common';
import {SortType} from '../const';

export default class FilmBlockPresenter {
  #popupComponent = null;
  #blockContainer = null;

  #sortComponent = null;
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
    this.#sortComponent = new SortPresenter(this.#blockContainer, this.#handleSortTypeChange);

    this.#mainFilmList = null;
    this.#topRatedFilmList = null;
    this.#mostCommentedFilmList = null;
  }

  init = (films) => {
    this.#films = [...films];

    this.#renderFilmBoard();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#mainListSortType === sortType) {
      return;
    }

    this.#mainListSortType = sortType;
    this.#renderSort();
    this.#mainFilmList.changeSortType(sortType);
  }

  #renderSort = () => {
    this.#sortComponent.init(this.#mainListSortType);
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

    render(this.#blockContainer, this.#filmBlockElement, RenderPosition.BEFOREEND);

    this.#mainFilmList = new FilmListPresenter(this.#filmBlockElement, this.#popupComponent, 'All movies. Upcoming', false, this.#handleFilmChange, this.#mainListSortType);
    this.#topRatedFilmList = new FilmListPresenter(this.#filmBlockElement, this.#popupComponent, 'Top rated', true, this.#handleFilmChange, SortType.RATING);
    this.#mostCommentedFilmList = new FilmListPresenter(this.#filmBlockElement, this.#popupComponent, 'Most commented', true, this.#handleFilmChange, SortType.COMMENT);

    this.#mainFilmList.init(this.#films);
    this.#topRatedFilmList.init(this.#films);
    this.#mostCommentedFilmList.init(this.#films);
  }
}
