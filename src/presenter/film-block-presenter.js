import SortView from '../view/sort-view';
import FilmBlockView from '../view/film-block-view';
import NoFilmView from '../view/no-film-view.js';
import {render, RenderPosition} from '../utils/render';
import FilmListPresenter from './film-list-presenter';

export default class FilmBlockPresenter {
  #popupComponent = null;
  #blockContainer = null;

  #sortComponent = new SortView();
  #noFilmComponent = new NoFilmView();
  #filmBlockElement = new FilmBlockView();

  #films = [];

  constructor(popupComponent, blockContainer) {
    this.#popupComponent = popupComponent;
    this.#blockContainer = blockContainer;
  }

  init = (films) => {
    this.#films = [...films];

    this.#renderFilmBoard();
  }

  #renderSort = () => {
    render(this.#filmBlockElement, this.#sortComponent, RenderPosition.BEFOREEND);
  }

  #renderNoFilms = () => {
    render(this.#blockContainer, this.#noFilmComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmBoard = () => {
    render(this.#blockContainer, this.#filmBlockElement, RenderPosition.BEFOREEND);

    if (this.#films.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();

    const mainFilmList = new FilmListPresenter(this.#filmBlockElement, this.#popupComponent, 'All movies. Upcoming');
    const topRatedFilmList = new FilmListPresenter(this.#filmBlockElement, this.#popupComponent, 'Top rated', true);
    const mostCommentedFilmList = new FilmListPresenter(this.#filmBlockElement, this.#popupComponent, 'Most commented', true);

    mainFilmList.init(this.#films);
    topRatedFilmList.init(this.#films);
    mostCommentedFilmList.init(this.#films);
  }
}
