import FilmBlockView from '../view/film-block-view';
import NoFilmView from '../view/no-film-view.js';
import {remove, render, RenderPosition} from '../utils/render';
import FilmListPresenter from './film-list-presenter';
import PopupPresenter from './popup-presenter';
import SortPresenter from './sort-presenter';
import {SortType, UserAction, UpdateType} from '../const';

export default class FilmBlockPresenter {
  #popupComponent = null;
  #blockContainer = null;
  #filmsModel = null;

  #sortComponent = null;
  #noFilmComponent = null;
  #filmBlockElement = null;

  #mainFilmList = null;
  #topRatedFilmList = null;
  #mostCommentedFilmList = null;

  #mainListSortType = SortType.DEFAULT;

  constructor(popupContainer, blockContainer, filmsModel) {
    this.#filmsModel = filmsModel;
    this.#filmsModel.addObserver(this.#handleModelEvent);

    this.#blockContainer = blockContainer;
    this.#popupComponent = new PopupPresenter(popupContainer, this.#handleViewAction);
    this.#sortComponent = new SortPresenter(this.#blockContainer, this.#handleSortTypeChange);

    this.#filmBlockElement = new FilmBlockView();
    this.#mainFilmList = new FilmListPresenter(this.#filmBlockElement, this.#popupComponent, 'All movies. Upcoming', false, this.#handleViewAction, this.#mainListSortType, this.#filmsModel);
    this.#topRatedFilmList = new FilmListPresenter(this.#filmBlockElement, this.#popupComponent, 'Top rated', true, this.#handleViewAction, SortType.RATING, this.#filmsModel);
    this.#mostCommentedFilmList = new FilmListPresenter(this.#filmBlockElement, this.#popupComponent, 'Most commented', true, this.#handleViewAction, SortType.COMMENT, this.#filmsModel);
  }

  get films() {
    return this.#filmsModel.films;
  }

  init = () => {
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
    this.#noFilmComponent = new NoFilmView();
    render(this.#blockContainer, this.#noFilmComponent, RenderPosition.BEFOREEND);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        break;
      case UpdateType.MINOR:
        if (this.#popupComponent.isShow() && (data.id === this.#popupComponent.getId())) {
          this.#popupComponent.init(data);
        }
        this.#mainFilmList.updateFilm(data);
        this.#topRatedFilmList.updateFilm(data);
        this.#mostCommentedFilmList.updateFilm(data);
        break;
      case UpdateType.MAJOR:
        this.#clearFilmBoard();
        this.#renderFilmBoard();
        break;
    }
  }

  #clearFilmBoard = () => {
    this.#mainFilmList.destroy();
    this.#topRatedFilmList.destroy();
    this.#mostCommentedFilmList.destroy();

    this.#sortComponent.destroy();

    remove(this.#filmBlockElement);
  }

  #renderFilmBoard = () => {
    if (this.films.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();

    render(this.#blockContainer, this.#filmBlockElement, RenderPosition.BEFOREEND);

    this.#mainFilmList.init();
    this.#topRatedFilmList.init();
    this.#mostCommentedFilmList.init();
  }
}
