import {createElement} from '../render';

const createFilmListTemplate = (title, isExtra = false) => {
  const filmsListAdditionalClass = (isExtra) ? 'films-list--extra' : '';
  const titleAdditionalClass = (!isExtra) ? 'visually-hidden' : '';

  return `<section class="films-list ${filmsListAdditionalClass}">
    <h2 class="films-list__title ${titleAdditionalClass}">${title}</h2>
    <div class="films-list__container"></div>
  </section>`;
};

export default class FilmListView {
  #element = null;
  #title = null;
  #isExtra = null;

  constructor(title, isExtra = false) {
    this.#title = title;
    this.#isExtra = isExtra;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmListTemplate(this.#title, this.#isExtra);
  }

  removeElement() {
    this.#element = null;
  }
}
