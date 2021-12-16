import SortView from '../view/sort-view';
import FilmBlockView from '../view/film-block-view';
import NoFilmView from '../view/no-film-view.js';
import {render, RenderPosition} from '../utils/render';
import FilmListPresenter from './film-list-presenter';
import PopupPresenter from './popup-presenter';

export default class FilmBlockPresenter {
  #popupComponent = null;
  #blockContainer = null;

  #sortComponent = new SortView();
  #noFilmComponent = new NoFilmView();
  #filmBlockElement = new FilmBlockView();

  #mainFilmList = null;
  #topRatedFilmList = null;
  #mostCommentedFilmList = null;

  #films = [];

  constructor(popupContainer, blockContainer) {
    this.#blockContainer = blockContainer;
    this.#popupComponent = new PopupPresenter(popupContainer);

    render(this.#blockContainer, this.#filmBlockElement, RenderPosition.BEFOREEND);

    this.#mainFilmList = new FilmListPresenter(this.#filmBlockElement, this.#popupComponent, 'All movies. Upcoming');
    this.#topRatedFilmList = new FilmListPresenter(this.#filmBlockElement, this.#popupComponent, 'Top rated', true);
    this.#mostCommentedFilmList = new FilmListPresenter(this.#filmBlockElement, this.#popupComponent, 'Most commented', true);
  }

  init = (films) => {
    this.#films = [...films];

    this.#renderFilmBoard();
  }

  #renderSort = () => {
    render(this.#filmBlockElement, this.#sortComponent, RenderPosition.BEFOREBEGIN);
  }

  #renderNoFilms = () => {
    render(this.#blockContainer, this.#noFilmComponent, RenderPosition.BEFOREEND);
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
