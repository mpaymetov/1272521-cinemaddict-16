import FilmBlockView from '../view/film-block-view';
import NoFilmView from '../view/no-film-view.js';
import {render, RenderPosition} from '../utils/render';
import FilmListPresenter from './film-list-presenter';
import PopupPresenter from './popup-presenter';
import SortPresenter from './sort-presenter';
//import {updateItem} from '../utils/common';
import {SortType, UserAction, UpdateType} from '../const';

export default class FilmBlockPresenter {
  #popupComponent = null;
  #blockContainer = null;
  #filmsModel = null;

  #sortComponent = null;
  #noFilmComponent = new NoFilmView();
  #filmBlockElement = new FilmBlockView();

  #mainFilmList = null;
  #topRatedFilmList = null;
  #mostCommentedFilmList = null;

  #mainListSortType = SortType.DEFAULT;

  constructor(popupContainer, blockContainer, filmsModel) {
    this.#blockContainer = blockContainer;
    //this.#popupComponent = new PopupPresenter(popupContainer, this.#handleFilmChange);
    this.#popupComponent = new PopupPresenter(popupContainer, this.#handleViewAction);
    this.#sortComponent = new SortPresenter(this.#blockContainer, this.#handleSortTypeChange);
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);

    this.#mainFilmList = null;
    this.#topRatedFilmList = null;
    this.#mostCommentedFilmList = null;
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
    render(this.#blockContainer, this.#noFilmComponent, RenderPosition.BEFOREEND);
  }

  #handleViewAction = (actionType, updateType, update) => {
    //console.log(actionType, updateType, update);

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
    }
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  }

  #handleModelEvent = (updateType, data) => {
    //console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        //this.#taskPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        if (this.#popupComponent.isShow() && (data.id === this.#popupComponent.getId())) {
          this.#popupComponent.init(data);
        }
        this.#mainFilmList.updateFilm(data);
        this.#topRatedFilmList.updateFilm(data);
        this.#mostCommentedFilmList.updateFilm(data);
        break;
    }
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
  }

  #renderFilmBoard = () => {
    if (this.films.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();

    render(this.#blockContainer, this.#filmBlockElement, RenderPosition.BEFOREEND);

    this.#mainFilmList = new FilmListPresenter(this.#filmBlockElement, this.#popupComponent, 'All movies. Upcoming', false, this.#handleViewAction, this.#mainListSortType, this.#filmsModel);
    this.#topRatedFilmList = new FilmListPresenter(this.#filmBlockElement, this.#popupComponent, 'Top rated', true, this.#handleViewAction, SortType.RATING, this.#filmsModel);
    this.#mostCommentedFilmList = new FilmListPresenter(this.#filmBlockElement, this.#popupComponent, 'Most commented', true, this.#handleViewAction, SortType.COMMENT, this.#filmsModel);

    this.#mainFilmList.init();
    this.#topRatedFilmList.init();
    this.#mostCommentedFilmList.init();
  }
}
