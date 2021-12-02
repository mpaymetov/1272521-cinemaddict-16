import {createElement} from '../render.js';

const createFilmBlockTemplate = () => (
  `<section class="films">
  </section>`
);

export default class FilmBlockView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmBlockTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
