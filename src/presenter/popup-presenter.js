import PopupView from '../view/popup-view';
import CommentBlockView from '../view/comment-block-view';
import CommentItemView from '../view/comment-item-view';
import {remove, render, RenderPosition, replace} from '../utils/render';

export default class PopupPresenter {
  #film = null;
  #popupContainer = null;
  #filmPopupComponent = null;

  constructor(popupContainer) {
    this.#popupContainer = popupContainer;
  }

  init = (film) => {
    this.#film = film;
    const prevFilmPopupComponent = this.#filmPopupComponent;
    this.#filmPopupComponent = new PopupView(this.#film);

    if (prevFilmPopupComponent === null) {
      this.#show();
      document.addEventListener('keydown', this.#handleOnEscKeyDown);
      return;
    }

    if (this.#popupContainer.contains(prevFilmPopupComponent.element)) {
      replace(this.#filmPopupComponent, prevFilmPopupComponent);
      this.#show();
    }

    remove(prevFilmPopupComponent);
  }

  #destroy = () => {
    remove(this.#filmPopupComponent);
    this.#filmPopupComponent = null;
  }

  #handleOnEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#hide();
      document.removeEventListener('keydown', this.#handleOnEscKeyDown);
    }
  };

  #hide = () => {
    this.#popupContainer.classList.remove('hide-overflow');
    this.#destroy();
  }

  #show = () => {
    const commentBlockElement = new CommentBlockView(this.#film.comments.length);
    const popupBottom = this.#filmPopupComponent.element.querySelector('.film-details__bottom-container');
    render(popupBottom, commentBlockElement, RenderPosition.BEFOREEND);

    const popupCommentsList = commentBlockElement.element.querySelector('.film-details__comments-list');
    this.#film.comments.forEach((comment) => {
      const commentItemElement = new CommentItemView(comment);
      render(popupCommentsList, commentItemElement, RenderPosition.BEFOREEND);
    });

    this.#popupContainer.classList.add('hide-overflow');

    this.#filmPopupComponent.setCloseClickHandler(() => {
      this.#hide();
      document.removeEventListener('keydown', this.#handleOnEscKeyDown);
    });

    render(this.#popupContainer, this.#filmPopupComponent, RenderPosition.BEFOREEND);
  }
}
