import PopupView from '../view/popup-view';
import CommentBlockView from '../view/comment-block-view';
import CommentItemView from '../view/comment-item-view';
import {remove, render, RenderPosition, replace} from '../utils/render';

export default class PopupPresenter {
  #film = null;
  #popupContainer = null;
  #filmPopupComponent = null;

  #changeData = null;

  constructor(popupContainer, changeData) {
    this.#popupContainer = popupContainer;
    this.#changeData = changeData;
  }

  init = (film) => {
    this.#film = film;
    const prevFilmPopupComponent = this.#filmPopupComponent;
    this.#filmPopupComponent = new PopupView(this.#film);

    this.#filmPopupComponent.setWatchlistAddedClickHandler(this.#handleWatchlistAddedClick);
    this.#filmPopupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

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

  isShow = () => (
    Boolean(this.#filmPopupComponent)
  )

  #destroy = () => {
    remove(this.#filmPopupComponent);
    this.#filmPopupComponent = null;
  }

  #handleWatchlistAddedClick = () => {
    this.#changeData({...this.#film, isAddedToWatchList: !this.#film.isAddedToWatchList});
  }

  #handleWatchedClick = () => {
    this.#changeData({...this.#film, isWatched: !this.#film.isWatched});
  }

  #handleFavoriteClick = () => {
    this.#changeData({...this.#film, isFavorite: !this.#film.isFavorite});
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
