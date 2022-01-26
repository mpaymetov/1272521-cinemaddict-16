import FilmBlockView from '../view/film-block-view';
import NoFilmView from '../view/no-film-view';
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
  #filmBlockElement = null;

  #mainFilmList = null;
  #topRatedFilmList = null;
  #mostCommentedFilmList = null;

  #mainListSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  constructor(popupContainer, blockContainer, filmsModel, filterModel, commentsModel) {
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;

    this.#blockContainer = blockContainer;
    this.#popupComponent = new PopupPresenter(popupContainer, this.#handleViewAction, this.#commentsModel);
    this.#sortComponent = new SortPresenter(this.#blockContainer, this.#handleSortTypeChange);

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

    this.#renderFilmBoard();
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

    this.#updateBoard(true, sortType);
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
    const update = {...data, comments: this.#commentsModel.comments};
    this.#filmsModel.updateFilm(updateType, update);
  }

  #updateBoard = (changeSort = false, sortType = SortType.DEFAULT) => {
    if (changeSort) {
      this.#mainListSortType = sortType;
      this.#mainFilmList.changeSortType(sortType);
    }
    this.#clearFilmBoard();
    this.#renderFilmBoard();
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.MINOR:
        this.#updateBoard(false);
        if (this.#popupComponent.isShow() && (data.id === this.#popupComponent.getId())) {
          this.#popupComponent.init(data);
        }
        break;
      case UpdateType.MAJOR:
        this.#updateBoard(true, SortType.DEFAULT);
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
