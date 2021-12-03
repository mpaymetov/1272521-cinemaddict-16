import {getCommentDate} from '../utils/film';
import AbstractView from './abstract-view.js';

const createCommentItemTemplate = (comment) => {
  const {author, date, message, emotion} = comment;
  const commentDate = getCommentDate(date);

  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${message}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${commentDate}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
};

export default class CommentItemView extends AbstractView {
  #comment = null;

  constructor(comment) {
    super();
    this.#comment = comment;
  }

  get template() {
    return createCommentItemTemplate(this.#comment);
  }
}
