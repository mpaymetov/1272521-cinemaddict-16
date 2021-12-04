import {render, remove, RenderPosition} from './utils/render.js';
import UserRankView from './view/user-rank-view';
import SiteMenuView from './view/site-menu-view';
import SortView from './view/sort-view';
import FilmBlockView from './view/film-block-view';
import NoFilmView from './view/no-film-view.js';
import FilmListView from './view/film-list-view';
import FilmCardView from './view/film-card-view';
import MoreButtonView from './view/more-button-view';
import StatisticView from './view/statistic-view';
import PopupView from './view/popup-view';
import CommentBlockView from './view/comment-block-view';
import CommentItemView from './view/comment-item-view';
import {generateFilm} from './mock/film.js';
import {generateFilter} from './mock/filter';

const FILM_COUNT = 18;
const FILM_COUNT_PER_STEP = 5;

const films = Array.from({length: FILM_COUNT}, generateFilm);
const filters = generateFilter(films);

const siteBodyElement = document.querySelector('body');
const siteHeader = siteBodyElement.querySelector('.header');
render(siteHeader, new UserRankView(), RenderPosition.BEFOREEND);

const siteMainElement = siteBodyElement.querySelector('.main');
render(siteMainElement, new SiteMenuView(filters), RenderPosition.BEFOREEND);
render(siteMainElement, new SortView(), RenderPosition.BEFOREEND);

const footerStatisticsElement = siteBodyElement.querySelector('.footer__statistics');
render(footerStatisticsElement, new StatisticView(films.length), RenderPosition.BEFOREEND);

const renderFilm = (listElement, film) => {
  const filmComponent = new FilmCardView(film);
  const filmPopupComponent = new PopupView(film);

  const hidePopup = () => {
    siteBodyElement.classList.remove('hide-overflow');
    remove(filmPopupComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      hidePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  const showPopup = () => {
    const commentBlockElement = new CommentBlockView(film.comments.length);
    const popupBottom = filmPopupComponent.element.querySelector('.film-details__bottom-container');
    render(popupBottom, commentBlockElement, RenderPosition.BEFOREEND);

    const popupCommentsList = commentBlockElement.element.querySelector('.film-details__comments-list');
    film.comments.forEach((comment) => {
      const commentItemElement = new CommentItemView(comment);
      render(popupCommentsList, commentItemElement, RenderPosition.BEFOREEND);
    });

    siteBodyElement.classList.add('hide-overflow');

    filmPopupComponent.setCloseClickHandler(() => {
      hidePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(siteBodyElement, filmPopupComponent, RenderPosition.BEFOREEND);
  };

  filmComponent.setClickHandler(() => {
    showPopup();
    document.addEventListener('keydown', onEscKeyDown);
  });

  render(listElement, filmComponent, RenderPosition.BEFOREEND);
};

const renderBoard = (mainElement, filmList) => {
  const filmBlockElement = new FilmBlockView();
  render(mainElement, filmBlockElement, RenderPosition.BEFOREEND);

  if (filmList.length === 0) {
    render(filmBlockElement, new NoFilmView(), RenderPosition.BEFOREEND);
  } else {
    const filmListElement = new FilmListView('All movies. Upcoming');
    render(filmBlockElement, filmListElement, RenderPosition.BEFOREEND);

    const filmListContainer = filmListElement.element.querySelector('.films-list .films-list__container');
    for (let i = 0; i < Math.min(FILM_COUNT, FILM_COUNT_PER_STEP); i++) {
      renderFilm(filmListContainer, filmList[i]);
    }

    if (filmList.length > FILM_COUNT_PER_STEP) {
      let renderedFilmCount = FILM_COUNT_PER_STEP;
      const filmListMain = filmBlockElement.element.querySelector('.films-list');

      const moreButtonComponent = new MoreButtonView();
      render(filmListMain, moreButtonComponent, RenderPosition.BEFOREEND);

      moreButtonComponent.setClickHandler(() => {
        filmList
          .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
          .forEach((film) => renderFilm(filmListContainer, film));

        renderedFilmCount += FILM_COUNT_PER_STEP;

        if (renderedFilmCount >= filmList.length) {
          remove(moreButtonComponent);
        }
      });
    }

    render(filmBlockElement, new FilmListView('Top rated', true), RenderPosition.BEFOREEND);
    render(filmBlockElement, new FilmListView('Most commented', true), RenderPosition.BEFOREEND);

    const LIST_EXTRA_FILM_COUNT = 2;
    const filmExtraListContainer = filmBlockElement.element.querySelectorAll('.films-list--extra .films-list__container');
    filmExtraListContainer.forEach((listContainer) => {
      for (let i = 0; i < LIST_EXTRA_FILM_COUNT; i++) {
        renderFilm(listContainer, filmList[i]);
      }
    });
  }
};

renderBoard(siteMainElement, films);
