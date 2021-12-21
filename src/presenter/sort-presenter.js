import SortView from '../view/sort-view';
import {remove, render, RenderPosition, replace} from '../utils/render';

export default class SortPresenter {
  #sortComponent = null;
  #sortType = null;
  #filmBlockElement = null;

  constructor(filmBlockElement) {
    this.#filmBlockElement = filmBlockElement;
  }

  init = (sortType) => {
    this.#sortType = sortType;

    const prevSortComponent = this.#sortComponent;
    this.#sortComponent = new SortView(this.#sortType);

    if (prevSortComponent === null) {
      render(this.#filmBlockElement, this.#sortComponent, RenderPosition.BEFOREBEGIN);
      return;
    }

    if (this.#filmBlockElement.contains(prevSortComponent.element)) {
      replace(this.#sortComponent, prevSortComponent);
    }

    remove(prevSortComponent);
  }

  #destroy = () => {
    remove(this.#sortComponent);
  }
}
