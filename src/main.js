import {render, RenderPosition} from './render.js';
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
render(siteHeader, new UserRankView().element, RenderPosition.BEFOREEND);

const siteMainElement = siteBodyElement.querySelector('.main');
render(siteMainElement, new SiteMenuView(filters).element, RenderPosition.BEFOREEND);
render(siteMainElement, new SortView().element, RenderPosition.BEFOREEND);

const footerStatisticsElement = siteBodyElement.querySelector('.footer__statistics');
render(footerStatisticsElement, new StatisticView(films.length).element, RenderPosition.BEFOREEND);

const renderFilm = (listElement, film) => {
  const filmComponent = new FilmCardView(film);
  const filmPopupComponent = new PopupView(film);

  const showPopup = () => {
    const commentBlockElement = new CommentBlockView(film.comments.length);
    const popupBottom = filmPopupComponent.element.querySelector('.film-details__bottom-container');
    render(popupBottom, commentBlockElement.element, RenderPosition.BEFOREEND);

    const popupCommentsList = commentBlockElement.element.querySelector('.film-details__comments-list');
    film.comments.forEach((comment) => {
      const commentItemElement = new CommentItemView(comment);
      render(popupCommentsList, commentItemElement.element, RenderPosition.BEFOREEND);
    });

    siteBodyElement.classList.add('hide-overflow');

    siteBodyElement.appendChild(filmPopupComponent.element);
  };

  const hidePopup = () => {
    siteBodyElement.classList.remove('hide-overflow');
    siteBodyElement.removeChild(filmPopupComponent.element);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      hidePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  filmComponent.element.querySelector('a.film-card__link').addEventListener('click', () => {
    showPopup();
    document.addEventListener('keydown', onEscKeyDown);
  });

  filmPopupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', (evt) => {
    evt.preventDefault();
    hidePopup();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(listElement, filmComponent.element, RenderPosition.BEFOREEND);
};

const renderBoard = (mainElement, filmList) => {
  const filmBlockElement = new FilmBlockView();
  render(mainElement, filmBlockElement.element, RenderPosition.BEFOREEND);

  if (filmList.length === 0) {
    render(filmBlockElement.element, new NoFilmView().element, RenderPosition.BEFOREEND);
  } else {
    const filmListElement = new FilmListView('All movies. Upcoming');
    render(filmBlockElement.element, filmListElement.element, RenderPosition.BEFOREEND);

    const filmListContainer = filmListElement.element.querySelector('.films-list .films-list__container');
    for (let i = 0; i < Math.min(FILM_COUNT, FILM_COUNT_PER_STEP); i++) {
      renderFilm(filmListContainer, filmList[i]);
    }

    if (filmList.length > FILM_COUNT_PER_STEP) {
      let renderedFilmCount = FILM_COUNT_PER_STEP;
      const filmListMain = filmBlockElement.element.querySelector('.films-list');
      render(filmListMain, new MoreButtonView().element, RenderPosition.BEFOREEND);

      const showMoreButton = filmListMain.querySelector('.films-list__show-more');

      showMoreButton.addEventListener('click', (evt) => {
        evt.preventDefault();
        filmList
          .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
          .forEach((film) => renderFilm(filmListContainer, film));

        renderedFilmCount += FILM_COUNT_PER_STEP;

        if (renderedFilmCount >= filmList.length) {
          showMoreButton.remove();
        }
      });
    }

    render(filmBlockElement.element, new FilmListView('Top rated', true).element, RenderPosition.BEFOREEND);
    render(filmBlockElement.element, new FilmListView('Most commented', true).element, RenderPosition.BEFOREEND);

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
