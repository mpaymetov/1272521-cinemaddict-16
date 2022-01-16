import UserRankView from './view/user-rank-view';
import StatisticView from './view/statistic-view';
import StatisticsView from './view/statistics-view';

import FilterPresenter from './presenter/filter-presenter';
import FilmBlockPresenter from './presenter/film-block-presenter';

import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import CommentsModel from './model/comments-model';

import {render, RenderPosition} from './utils/render.js';
import {FILM_COUNT, MenuItem} from './const';
import {generateFilm} from './mock/film.js';

const films = Array.from({length: FILM_COUNT}, generateFilm);

const filterModel = new FilterModel();
const filmsModel = new FilmsModel();
filmsModel.films = films;
const commentsModel = new CommentsModel();

const siteBodyElement = document.querySelector('body');
const siteHeader = siteBodyElement.querySelector('.header');
const siteMainElement = siteBodyElement.querySelector('.main');
const footerStatisticsElement = siteBodyElement.querySelector('.footer__statistics');

render(siteHeader, new UserRankView(), RenderPosition.BEFOREEND);
render(footerStatisticsElement, new StatisticView(films.length), RenderPosition.BEFOREEND);

const handleFilterClick = (filterItem) => {
  switch (filterItem) {
    case MenuItem.FILMS:
      // Показать фильтры
      // Показать доску
      // Скрыть статистику
      break;
    case MenuItem.STATISTICS:
      //filmBlockPresenter.destroy();
      // Показать статистику
      break;
  }
};

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const filmBlockPresenter = new FilmBlockPresenter(siteBodyElement, siteMainElement, filmsModel, filterModel, commentsModel);

filterPresenter.init();
//filmBlockPresenter.init();

render(siteMainElement, new StatisticsView(filmsModel.films), RenderPosition.BEFOREEND);
