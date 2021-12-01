import {createElement} from '../render.js';

const createStatisticTemplate = (count) => (
  `<p>${count} movies inside</p>`
);

export default class StatisticView {
  #element = null;
  #count = null;

  constructor(count) {
    this.#count = count;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createStatisticTemplate(this.#count);
  }

  removeElement() {
    this.#element = null;
  }
}