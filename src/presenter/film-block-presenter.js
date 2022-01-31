import FilmBlockView from '../view/film-block-view';
import NoFilmView from '../view/no-film-view';
import LoadingView from '../view/loading-view.js';
import FilmListPresenter from './film-list-presenter';
import PopupPresenter from './popup-presenter';
import SortPresenter from './sort-presenter';
import {remove, render, RenderPosition} from '../utils/render';
import {SortType, UserAction, UpdateType, FilterType} from '../const';
import {filter} from '../utils/filter';

export default class FilmBlockPresenter {
  #popupComponent = null;
  #blockContainer = null;
  #filmsModel = null;
  #filterModel = null;
  #commentsModel = null;

  #sortComponent = null;
  #noFilmComponent = null;
  #loadingComponent = null;
  #filmBlockElement = null;

  #mainFilmList = null;
  #topRatedFilmList = null;
  #mostCommentedFilmList = null;

  #mainListSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  #initHandler = null;

  constructor(popupContainer, blockContainer, filmsModel, filterModel, commentsModel, initHandler) {
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;

    this.#initHandler = initHandler;

    this.#blockContainer = blockContainer;
    this.#popupComponent = new PopupPresenter(popupContainer, this.#handleViewAction, this.#commentsModel);
    this.#sortComponent = new SortPresenter(this.#blockContainer, this.#handleSortTypeChange);
    this.#loadingComponent = new LoadingView();

    this.#filmBlockElement = new FilmBlockView();
    this.#mainFilmList = new FilmListPresenter(this.#filmBlockElement, this.#popupComponent, 'All movies. Upcoming', false,
      this.#handleViewAction, this.#mainListSortType, this.#filmsModel,this.#filterModel, this.#commentsModel);
    this.#topRatedFilmList = new FilmListPresenter(this.#filmBlockElement, this.#popupComponent, 'Top rated', true,
      this.#handleViewAction, SortType.RATING, this.#filmsModel, this.#filterModel, this.#commentsModel);
    this.#mostCommentedFilmList = new FilmListPresenter(this.#filmBlockElement, this.#popupComponent, 'Most commented', true,
      this.#handleViewAction, SortType.COMMENT, this.#filmsModel, this.#filterModel, this.#commentsModel);
  }

  init = () => {
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleCommentsModelEvent);

    this.#renderFilmBoard(true);
  }

  destroy = () => {
    this.#clearFilmBoard();

    remove(this.#filmBlockElement);

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
    this.#commentsModel.removeObserver(this.#handleCommentsModelEvent);
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    return filteredFilms;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#mainListSortType === sortType) {
      return;
    }

    this.#updateBoard(true, true, sortType);
  }

  #renderSort = () => {
    this.#sortComponent.init(this.#mainListSortType);
  }

  #renderNoFilms = () => {
    this.#noFilmComponent = new NoFilmView(this.#filterType);
    render(this.#blockContainer, this.#noFilmComponent, RenderPosition.BEFOREEND);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  #handleCommentsModelEvent = (updateType, data) => {
    this.#filmsModel.updateFilmModel(updateType, data);
  }

  #updateBoard = (isResetRenderedFilmCount = true, changeSort = false, sortType = SortType.DEFAULT) => {
    if (changeSort) {
      this.#mainListSortType = sortType;
      this.#mainFilmList.changeSortType(sortType);
    }
    this.#clearFilmBoard();
    this.#renderFilmBoard(isResetRenderedFilmCount);
  }

  #renderLoading = () => {
    render(this.#blockContainer, this.#loadingComponent, RenderPosition.BEFOREEND);
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#popupComponent.isShow() && (data.id === this.#popupComponent.getId())) {
          this.#popupComponent.init(data);
        }
        break;
      case UpdateType.MINOR:
        this.#updateBoard(false, false, SortType.DEFAULT);
        if (this.#popupComponent.isShow() && (data.id === this.#popupComponent.getId())) {
          this.#popupComponent.init(data);
        }
        break;
      case UpdateType.MAJOR:
        this.#updateBoard(true, true, SortType.DEFAULT);
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#initHandler(this.films);
        remove(this.#loadingComponent);
        this.#renderFilmBoard(true);
        break;
    }
  }

  #clearFilmBoard = () => {
    if (this.#noFilmComponent) {
      remove(this.#noFilmComponent);
    }

    this.#mainFilmList.destroy();
    this.#topRatedFilmList.destroy();
    this.#mostCommentedFilmList.destroy();

    this.#sortComponent.destroy();

    remove(this.#filmBlockElement);
    remove(this.#loadingComponent);
  }

  #renderFilmBoard = (isResetRenderedFilmCount) => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.films.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();

    render(this.#blockContainer, this.#filmBlockElement, RenderPosition.BEFOREEND);

    this.#mainFilmList.init(isResetRenderedFilmCount);
    this.#topRatedFilmList.init(isResetRenderedFilmCount);
    this.#mostCommentedFilmList.init(isResetRenderedFilmCount);
  }
}
