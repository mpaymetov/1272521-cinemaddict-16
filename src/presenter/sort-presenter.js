import SortView from '../view/sort-view';
import {remove, render, RenderPosition, replace} from '../utils/render';

export default class SortPresenter {
  #sortComponent = null;
  #sortType = null;
  #sortContainer = null;
  #changeData = null;

  constructor(sortContainer, changeData) {
    this.#sortContainer = sortContainer;
    this.#changeData = changeData;
  }

  init = (sortType) => {
    this.#sortType = sortType;

    const prevSortComponent = this.#sortComponent;
    this.#sortComponent = new SortView(this.#sortType);

    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortChangeClick);

    if (prevSortComponent === null) {
      render(this.#sortContainer, this.#sortComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#sortContainer.contains(prevSortComponent.element)) {
      replace(this.#sortComponent, prevSortComponent);
    }

    remove(prevSortComponent);
  }

  #handleSortChangeClick = (sortType) => {
    this.#changeData(sortType);
  }

  destroy = () => {
    remove(this.#sortComponent);
  }
}
