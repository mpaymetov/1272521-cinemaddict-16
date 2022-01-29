import CommentBlockView from '../view/comment-block-view';
import {remove, render, RenderPosition, replace} from '../utils/render';
import {SHAKE_ANIMATION_TIMEOUT} from '../const';

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

const shake = (element, callback) => {
  element.classList.add('shake');
  setTimeout(() => {
    element.classList.remove('shake');
    callback();
  }, SHAKE_ANIMATION_TIMEOUT);
};

export default class CommentBlockPresenter {
  #container = null;
  #commentsModel = null;
  #commentBlockComponent = null;
  #dataChange = null;

  #deletingCommentId = null;

  constructor(container, commentsModel, dataChange) {
    this.#container = container;
    this.#commentsModel = commentsModel;
    this.#dataChange = dataChange;
  }

  init = () => {
    const prevCommentBlockComponent = this.#commentBlockComponent;
    this.#commentBlockComponent = new CommentBlockView(this.comments);

    this.#commentBlockComponent.setViewActionHandler(this.#dataChange);

    if (prevCommentBlockComponent === null) {
      render(this.#container, this.#commentBlockComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#container.contains(prevCommentBlockComponent.element)) {
      replace(this.#commentBlockComponent, prevCommentBlockComponent);
    }

    remove(prevCommentBlockComponent);

    this.#deletingCommentId = null;
  }

  setViewState = (state, data = null) => {
    const shakeElement  = (this.#deletingCommentId) ?
      this.#commentBlockComponent.element.querySelector(`#comment-${this.#deletingCommentId}`) :
      this.#commentBlockComponent.element.querySelector('.film-details__new-comment');

    const resetState = () => {
      this.#commentBlockComponent.updateData({
        deletingCommentId: null,
        isCommentSaving: false,
      }, false);
    };

    switch (state) {
      case State.SAVING:
        this.#commentBlockComponent.updateData({
          isCommentSaving: true,
        }, false);
        break;
      case State.DELETING:
        this.#deletingCommentId = data;
        this.#commentBlockComponent.updateData({
          deletingCommentId: data,
        }, false);
        break;
      case State.ABORTING:
        this.#deletingCommentId = null;
        shake(shakeElement, resetState);
        break;
    }
  }

  getNewComment = () => (
    this.#commentBlockComponent.getNewCommentData()
  )

  get comments() {
    return this.#commentsModel.comments;
  }
}
