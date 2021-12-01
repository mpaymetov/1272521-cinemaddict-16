import {capitalizeFirstLetter} from '../utils';

const createFilterItemTemplate = (filter, isFirst, isActive) => {
  const {name, count} = filter;
  const activeClass = (isActive) ? 'main-navigation__item--active' : '';
  return (isFirst) ?
    `<a href="#${name}" class="main-navigation__item ${activeClass}">All movies</a>` :
    `<a href="#${name}" class="main-navigation__item ${activeClass}">${capitalizeFirstLetter(name)} <span class="main-navigation__item-count">${count}</span></a>`;
};

export const createSiteMenuTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0, index === 0))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};
