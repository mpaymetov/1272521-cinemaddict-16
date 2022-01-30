import AbstractView from './abstract-view';
import {filter} from '../utils/filter';
import {FilterType} from '../const';
import {getUserRank} from '../utils/statistics';

const createUserRankTemplate = (rank) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${rank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class UserRankView extends AbstractView {
  #rank = null;

  constructor(films) {
    super();
    const watchedFilms = filter[FilterType.HISTORY](films);
    this.#rank = getUserRank(watchedFilms.length);
  }

  get template() {
    return createUserRankTemplate(this.#rank);
  }
}
