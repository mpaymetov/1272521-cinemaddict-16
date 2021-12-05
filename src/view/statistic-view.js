import AbstractView from './abstract-view.js';

const createStatisticTemplate = (count) => (
  `<p>${count} movies inside</p>`
);

export default class StatisticView extends AbstractView {
  #count = null;

  constructor(count) {
    super();
    this.#count = count;
  }

  get template() {
    return createStatisticTemplate(this.#count);
  }
}
