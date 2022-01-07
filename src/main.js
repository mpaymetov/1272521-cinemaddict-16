import {render, RenderPosition} from './utils/render.js';
import UserRankView from './view/user-rank-view';
import StatisticView from './view/statistic-view';
import FilterPresenter from './presenter/filter-presenter';
import FilmBlockPresenter from './presenter/film-block-presenter';
import {generateFilm} from './mock/film.js';
import {FILM_COUNT} from './const';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';

const films = Array.from({length: FILM_COUNT}, generateFilm);

const filterModel = new FilterModel();
const filmsModel = new FilmsModel();
filmsModel.films = films;

const siteBodyElement = document.querySelector('body');
const siteHeader = siteBodyElement.querySelector('.header');
const siteMainElement = siteBodyElement.querySelector('.main');
const footerStatisticsElement = siteBodyElement.querySelector('.footer__statistics');

render(siteHeader, new UserRankView(), RenderPosition.BEFOREEND);
render(footerStatisticsElement, new StatisticView(films.length), RenderPosition.BEFOREEND);

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const filmBlockPresenter = new FilmBlockPresenter(siteBodyElement, siteMainElement, filmsModel, filterModel);

filterPresenter.init();
filmBlockPresenter.init();
