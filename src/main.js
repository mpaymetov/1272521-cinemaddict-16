import {render, RenderPosition} from './utils/render.js';
import UserRankView from './view/user-rank-view';
import SiteMenuView from './view/site-menu-view';
import StatisticView from './view/statistic-view';
import FilmBlockPresenter from './presenter/film-block-presenter';
import {generateFilm} from './mock/film.js';
import {generateFilter} from './mock/filter';
import {FILM_COUNT} from './const';

const films = Array.from({length: FILM_COUNT}, generateFilm);
const filters = generateFilter(films);

const siteBodyElement = document.querySelector('body');
const siteHeader = siteBodyElement.querySelector('.header');
render(siteHeader, new UserRankView(), RenderPosition.BEFOREEND);

const siteMainElement = siteBodyElement.querySelector('.main');
render(siteMainElement, new SiteMenuView(filters), RenderPosition.BEFOREEND);

const footerStatisticsElement = siteBodyElement.querySelector('.footer__statistics');
render(footerStatisticsElement, new StatisticView(films.length), RenderPosition.BEFOREEND);

const filmBlockPresenter = new FilmBlockPresenter(siteBodyElement, siteMainElement);
filmBlockPresenter.init(films);
