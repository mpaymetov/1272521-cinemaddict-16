import {renderTemplate, RenderPosition} from './render.js';
import {createUserRankTemplate} from './view/user-rank-view';
import {createSiteMenuTemplate} from './view/site-menu-view';
import {createSortTemplate} from './view/sort-view';
import {createFilmBlockTemplate} from './view/film-block-view';
import {createFilmListTemplate, createFilmListExtraTemplate} from './view/film-list-view';
import {createFilmCardTemplate} from './view/film-card-view';
import {createStatisticTemplate} from './view/statistic-view';

const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

renderTemplate(siteHeader, createUserRankTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSiteMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createFilmBlockTemplate(), RenderPosition.BEFOREEND);

const filmBlockElement = siteMainElement.querySelector('.films');
renderTemplate(filmBlockElement, createFilmListTemplate(), RenderPosition.BEFOREEND);
renderTemplate(filmBlockElement, createFilmListExtraTemplate(), RenderPosition.BEFOREEND);
renderTemplate(filmBlockElement, createFilmListExtraTemplate(), RenderPosition.BEFOREEND);

const LIST_FILM_COUNT = 5;
const filmsListElement = siteMainElement.querySelector('.films-list .films-list__container');
for (let i = 0; i < LIST_FILM_COUNT; i++) {
  renderTemplate(filmsListElement, createFilmCardTemplate(), RenderPosition.BEFOREEND);
}

const LIST_EXTRA_FILM_COUNT = 2;
const filmsExtraListElement = siteMainElement.querySelectorAll('.films-list--extra .films-list__container');
filmsExtraListElement.forEach((listElement) => {
  for (let i = 0; i < LIST_EXTRA_FILM_COUNT; i++) {
    renderTemplate(listElement, createFilmCardTemplate(), RenderPosition.BEFOREEND);
  }
});

const footerStatisticsElement = document.querySelector('.footer__statistics');
renderTemplate(footerStatisticsElement, createStatisticTemplate(), RenderPosition.BEFOREEND);
