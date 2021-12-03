import AbstractView from './abstract-view.js';

const createFilmBlockTemplate = () => (
  '<section class="films"></section>'
);

export default class FilmBlockView extends AbstractView {
  get template() {
    return createFilmBlockTemplate();
  }
}
