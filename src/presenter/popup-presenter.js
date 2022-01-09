import PopupView from '../view/popup-view';
import CommentBlockPresenter from './comment-block-presenter';
import {remove, render, RenderPosition, replace} from '../utils/render';
import {UpdateType, UserAction} from '../const';

export default class PopupPresenter {
  #film = null;
  #popupContainer = null;
  #filmPopupComponent = null;
  #commentBlockPresenter = null;
  #commentsModel = null;

  #changeData = null;
  #commentMap = new Map();

  constructor(popupContainer, changeData, commentsModel) {
    this.#popupContainer = popupContainer;
    this.#changeData = changeData;
    this.#commentsModel = commentsModel;
  }

  init = (film) => {
    this.#film = film;
    this.comments.forEach((comment) => {this.#commentMap.set(comment.id, comment);});

    const prevFilmPopupComponent = this.#filmPopupComponent;
    this.#filmPopupComponent = new PopupView(this.#film);

    const commentBlockContainer = this.#filmPopupComponent.element.querySelector('.film-details__bottom-container');
    this.#commentBlockPresenter = new CommentBlockPresenter(commentBlockContainer, this.#commentsModel, this.#handleViewAction);

    this.#filmPopupComponent.setWatchlistAddedClickHandler(this.#handleWatchlistAddedClick);
    this.#filmPopupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFilmPopupComponent === null) {
      this.#show();
      document.addEventListener('keydown', this.#handleOnEscKeyDown);
      document.addEventListener('keydown', this.#handleOnCtrlEnterKeyDown);
      return;
    }

    if (this.#popupContainer.contains(prevFilmPopupComponent.element)) {
      replace(this.#filmPopupComponent, prevFilmPopupComponent);
      this.#show();
    }

    remove(prevFilmPopupComponent);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update, this.#film);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, this.#commentMap.get(update), this.#film);
        break;
    }
  }

  isShow = () => (
    Boolean(this.#filmPopupComponent)
  )

  getId = () => (
    this.#film.id
  )

  get comments() {
    return this.#commentsModel.comments;
  }

  #destroy = () => {
    remove(this.#filmPopupComponent);
    this.#filmPopupComponent = null;
  }

  #handleWatchlistAddedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, isAddedToWatchList: !this.#film.isAddedToWatchList}
    );
  }

  #handleWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, isWatched: !this.#film.isWatched}
    );
  }

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, isFavorite: !this.#film.isFavorite}
    );
  }

  #handleOnEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#hide();
      document.removeEventListener('keydown', this.#handleOnEscKeyDown);
      document.removeEventListener('keydown', this.#handleOnCtrlEnterKeyDown);
    }
  };

  #handleOnCtrlEnterKeyDown = (evt) => {
    if (evt.ctrlKey && evt.key === 'Enter') {
      evt.preventDefault();
      this.#handleViewAction(UserAction.ADD_COMMENT, UpdateType.PATCH, this.#commentBlockPresenter.getNewComment());
    }
  }

  #hide = () => {
    this.#popupContainer.classList.remove('hide-overflow');
    this.#destroy();
  }

  #show = () => {
    this.#commentBlockPresenter.init();

    this.#popupContainer.classList.add('hide-overflow');

    this.#filmPopupComponent.setCloseClickHandler(() => {
      this.#hide();
      document.removeEventListener('keydown', this.#handleOnEscKeyDown);
      document.removeEventListener('keydown', this.#handleOnCtrlEnterKeyDown);
    });

    render(this.#popupContainer, this.#filmPopupComponent, RenderPosition.BEFOREEND);
  }
}
