import {capitalizeFirstLetter} from '../utils/film';
import AbstractView from './abstract-view.js';
import {FilterType, MenuItem} from '../const';

const createFilterItemTemplate = (filter, isFirst, activeFilterType) => {
  const {type, name, count} = filter;
  const activeClass = (type === activeFilterType) ? 'main-navigation__item--active' : '';
  return (isFirst) ?
    `<a href="#${name}" class="main-navigation__item ${activeClass}"
      data-filter-type="${type}" data-menu-type="${MenuItem.FILMS}">All movies</a>` :
    `<a href="#${name}" class="main-navigation__item ${activeClass}"
      data-filter-type="${type}" data-menu-type="${MenuItem.FILMS}">${capitalizeFirstLetter(name)} <span class="main-navigation__item-count">${count}</span></a>`;
};

const createSiteMenuTemplate = (filterItems, currentFilterType, menuType) => {
  const activeClass = (menuType === MenuItem.STATISTICS) ? 'main-navigation__additional--active' : '';

  const filterType = (menuType === MenuItem.FILMS) ? currentFilterType : '';

  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0, filterType))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional ${activeClass}"
      data-filter-type="${FilterType.HISTORY}" data-menu-type="${MenuItem.STATISTICS}">Stats</a>
  </nav>`;
};

export default class FilterView extends AbstractView {
  #filter = null;
  #currentFilter = null;
  #currentMenuType = null;

  constructor(filter, currentFilterType, menuType) {
    super();
    this.#filter = filter;
    this.#currentFilter = currentFilterType;
    this.#currentMenuType = menuType;
  }

  get template() {
    return createSiteMenuTemplate(this.#filter, this.#currentFilter, this.#currentMenuType);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.querySelector('.main-navigation__items').addEventListener('click', this.#filterTypeChangeHandler);
    this.element.querySelector('.main-navigation__additional').addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType, evt.target.dataset.menuType);
  }
}
