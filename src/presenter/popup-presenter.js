import PopupView from '../view/popup-view';
import CommentBlockPresenter from './comment-block-presenter';
import {remove, render, RenderPosition, replace} from '../utils/render';
import {UpdateType, UserAction} from '../const';
import dayjs from 'dayjs';

export default class PopupPresenter {
  #film = null;
  #popupContainer = null;
  #filmPopupComponent = null;
  #commentBlockPresenter = null;
  #commentsModel = null;

  #commentsFilmId = null;

  #changeData = null;
  #commentMap = new Map();

  constructor(popupContainer, changeData, commentsModel) {
    this.#popupContainer = popupContainer;
    this.#changeData = changeData;
    this.#commentsModel = commentsModel;
  }

  init = (film) => {
    this.#film = film;
    const prevFilmPopupComponent = this.#filmPopupComponent;
    this.#filmPopupComponent = new PopupView(this.#film);

    const commentBlockContainer = this.#filmPopupComponent.element.querySelector('.film-details__bottom-container');
    this.#commentBlockPresenter = new CommentBlockPresenter(commentBlockContainer, this.#commentsModel, this.#handleViewAction);

    this.#filmPopupComponent.setWatchlistAddedClickHandler(this.#handleWatchlistAddedClick);
    this.#filmPopupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFilmPopupComponent === null) {
      document.addEventListener('keydown', this.#handleOnEscKeyDown);
      document.addEventListener('keydown', this.#handleOnCtrlEnterKeyDown);
    } else if (this.#popupContainer.contains(prevFilmPopupComponent.element)) {
      replace(this.#filmPopupComponent, prevFilmPopupComponent);
      remove(prevFilmPopupComponent);
    }

    this.#showComments(film);
    this.#show();
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#commentBlockPresenter.setSavingNewComment();
        this.#commentsModel.addComment(updateType, update, this.#film);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentBlockPresenter.setDeletingCommentId(update);
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

  #showComments = (film) => {
    if (this.#commentsFilmId === film.id) {
      this.comments.forEach((comment) => {this.#commentMap.set(comment.id, comment);});
      this.#commentBlockPresenter.init();
    } else {
      this.#commentsFilmId = film.id;
      this.#commentsModel.init(film);
    }
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
      {...this.#film, isWatched: !this.#film.isWatched, watchingDate: dayjs()}
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
      const commentData = this.#commentBlockPresenter.getNewComment();
      if (commentData.emotion && commentData.comment) {
        this.#handleViewAction(UserAction.ADD_COMMENT, UpdateType.MINOR, commentData);
      }
    }
  }

  #hide = () => {
    this.#popupContainer.classList.remove('hide-overflow');
    this.#destroy();
  }

  #handleCloseClick = () => {
    this.#hide();
    document.removeEventListener('keydown', this.#handleOnEscKeyDown);
    document.removeEventListener('keydown', this.#handleOnCtrlEnterKeyDown);
  }

  #show = () => {
    this.#popupContainer.classList.add('hide-overflow');
    this.#filmPopupComponent.setCloseClickHandler(this.#handleCloseClick);
    render(this.#popupContainer, this.#filmPopupComponent, RenderPosition.BEFOREEND);
  }
}
