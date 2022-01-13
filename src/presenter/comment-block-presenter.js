import CommentBlockView from '../view/comment-block-view';
import {remove, render, RenderPosition, replace} from '../utils/render';

export default class CommentBlockPresenter {
  #container = null;
  #commentsModel = null;
  #commentBlockComponent = null;
  #dataChange = null;

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
  }

  getNewComment = () => (
    this.#commentBlockComponent.getNewCommentData()
  );

  get comments() {
    return this.#commentsModel.comments;
  }
}
