import {createElement} from '../render.js';

const createMoreButtonTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class MoreButtonView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createMoreButtonTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
