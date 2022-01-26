import UserRankView from './view/user-rank-view';
import StatisticView from './view/statistic-view';
import StatisticsView from './view/statistics-view';
import FilterPresenter from './presenter/filter-presenter';
import FilmBlockPresenter from './presenter/film-block-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import CommentsModel from './model/comments-model';
import {remove, render, RenderPosition} from './utils/render.js';
import {MenuType} from './const';
import ApiService from './api-service.js';

const AUTHORIZATION = 'Basic HLh6aRHkt7VyL6fn';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

const siteBodyElement = document.querySelector('body');
const siteHeader = siteBodyElement.querySelector('.header');
const siteMainElement = siteBodyElement.querySelector('.main');
const footerStatisticsElement = siteBodyElement.querySelector('.footer__statistics');

const filterModel = new FilterModel();
const filmsModel = new FilmsModel(new ApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel();

const filmBlockPresenter = new FilmBlockPresenter(siteBodyElement, siteMainElement, filmsModel, filterModel, commentsModel);

let statisticsElement = null;

const handleMenuClick = (menuType) => {
  switch (menuType) {
    case MenuType.FILMS:
      remove(statisticsElement);
      filmBlockPresenter.init();
      break;
    case MenuType.STATISTICS:
      filmBlockPresenter.destroy();
      statisticsElement = new StatisticsView(filmsModel);
      render(siteMainElement, statisticsElement, RenderPosition.BEFOREEND);
      break;
  }
};

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel, handleMenuClick);

render(siteHeader, new UserRankView(), RenderPosition.BEFOREEND);
//render(footerStatisticsElement, new StatisticView(films.length), RenderPosition.BEFOREEND);
render(footerStatisticsElement, new StatisticView('30'), RenderPosition.BEFOREEND);

filterPresenter.init();
filmBlockPresenter.init();

filmsModel.init();
