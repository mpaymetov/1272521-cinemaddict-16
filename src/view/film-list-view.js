import AbstractView from './abstract-view.js';

const createFilmListTemplate = (title, isExtra = false) => {
  const filmsListAdditionalClass = (isExtra) ? 'films-list--extra' : '';
  const titleAdditionalClass = (!isExtra) ? 'visually-hidden' : '';

  return `<section class="films-list ${filmsListAdditionalClass}">
    <h2 class="films-list__title ${titleAdditionalClass}">${title}</h2>
    <div class="films-list__container"></div>
  </section>`;
};

export default class FilmListView extends AbstractView {
  #title = null;
  #isExtra = null;

  constructor(title, isExtra = false) {
    super();
    this.#title = title;
    this.#isExtra = isExtra;
  }

  get template() {
    return createFilmListTemplate(this.#title, this.#isExtra);
  }
}
