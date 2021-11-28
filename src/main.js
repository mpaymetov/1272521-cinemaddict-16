import {renderTemplate, RenderPosition} from './render.js';
import {createUserRankTemplate} from './view/user-rank-view';
import {createSiteMenuTemplate} from './view/site-menu-view';
import {createSortTemplate} from './view/sort-view';
import {createFilmBlockTemplate} from './view/film-block-view';
import {createFilmListTemplate} from './view/film-list-view';
import {createFilmCardTemplate} from './view/film-card-view';
import {createMoreButtonTemplate} from './view/more-button-view';
import {createStatisticTemplate} from './view/statistic-view';
import {createPopupTemplate} from './view/popup-view';
import {createCommentBlockTemplate} from './view/comment-block-view';
import {createCommentItemTemplate} from './view/comment-item-view';
import {generateFilm} from './mock/film.js';
import {generateFilter} from './mock/filter';

const FILM_COUNT = 18;
const FILM_COUNT_PER_STEP = 5;

const films = Array.from({length: FILM_COUNT}, generateFilm);
const filters = generateFilter(films);

const siteBodyElement = document.querySelector('body');
const siteHeader = document.querySelector('.header');
const siteMainElement = siteBodyElement.querySelector('.main');

renderTemplate(siteHeader, createUserRankTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSiteMenuTemplate(filters), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createFilmBlockTemplate(), RenderPosition.BEFOREEND);

const filmBlockElement = siteMainElement.querySelector('.films');
renderTemplate(filmBlockElement, createFilmListTemplate('All movies. Upcoming'), RenderPosition.BEFOREEND);

const filmsListElement = siteMainElement.querySelector('.films-list .films-list__container');
for (let i = 0; i < Math.min(FILM_COUNT, FILM_COUNT_PER_STEP); i++) {
  renderTemplate(filmsListElement, createFilmCardTemplate(films[i]), RenderPosition.BEFOREEND);
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;
  const filmListMain = filmBlockElement.querySelector('.films-list');
  renderTemplate(filmListMain, createMoreButtonTemplate(), RenderPosition.BEFOREEND);

  const showMoreButton = filmListMain.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderTemplate(filmsListElement, createFilmCardTemplate(film), RenderPosition.BEFOREEND));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

renderTemplate(filmBlockElement, createFilmListTemplate('Top rated', true), RenderPosition.BEFOREEND);
renderTemplate(filmBlockElement, createFilmListTemplate('Most commented', true), RenderPosition.BEFOREEND);

const LIST_EXTRA_FILM_COUNT = 2;
const filmsExtraListElement = siteMainElement.querySelectorAll('.films-list--extra .films-list__container');
filmsExtraListElement.forEach((listElement) => {
  for (let i = 0; i < LIST_EXTRA_FILM_COUNT; i++) {
    renderTemplate(listElement, createFilmCardTemplate(films[i]), RenderPosition.BEFOREEND);
  }
});

const footerStatisticsElement = document.querySelector('.footer__statistics');
renderTemplate(footerStatisticsElement, createStatisticTemplate(films.length), RenderPosition.BEFOREEND);

renderTemplate(siteBodyElement, createPopupTemplate(films[0]), RenderPosition.BEFOREEND);

const popupBottom = document.querySelector('.film-details__bottom-container');
renderTemplate(popupBottom, createCommentBlockTemplate(films[0].comments), RenderPosition.BEFOREEND);

const popupCommentsList = popupBottom.querySelector('.film-details__comments-list');
films[0].comments.forEach((comment) => {
  renderTemplate(popupCommentsList, createCommentItemTemplate(comment), RenderPosition.BEFOREEND);
});
