import he from 'he';
import SmartView from './smart-view';
import {getCommentDate} from '../utils/film';
import {UserAction, UpdateType} from '../const';

const createCommentItemTemplate = (commentItem, deletingCommentId) => {
  const {id, author, date, comment, emotion} = commentItem;
  const commentDate = getCommentDate(date);
  const isDeleting = deletingCommentId === id;

  return `<li class="film-details__comment" id="comment-${id}">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(comment)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${commentDate}</span>
        <button class="film-details__comment-delete" data-id="${id}"
          ${isDeleting ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
      </p>
    </div>
  </li>`;
};

const createCommentBlockTemplate = (data) => {
  const emojiImg = (data.commentEmoji) ? `<img src="./images/emoji/${data.commentEmoji}.png" width="55" height="55" alt="emoji-smile">` : '';
  const commentText = (data.commentText) ? data.commentText : '';
  const emojiSmileActive = (data.commentEmoji === 'smile') ? 'checked' : '';
  const emojiSleepingActive = (data.commentEmoji === 'sleeping') ? 'checked' : '';
  const emojiPukeActive = (data.commentEmoji === 'puke') ? 'checked' : '';
  const emojiAngryActive = (data.commentEmoji === 'angry') ? 'checked' : '';
  const commentItemsTemplate = Array.from(data.comments)
    .map((comment) => createCommentItemTemplate(comment, data.deletingCommentId))
    .join('');

  return `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${data.comments.length}</span></h3>

    <ul class="film-details__comments-list">
        ${commentItemsTemplate}
    </ul>

    <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">${emojiImg}</div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here"
          name="comment" ${data.isCommentSaving ? 'disabled' : ''}>${commentText}</textarea>
      </label>

      <div class="film-details__emoji-list">
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile"
          value="smile" ${emojiSmileActive} ${data.isCommentSaving ? 'disabled' : ''}>
        <label class="film-details__emoji-label" for="emoji-smile">
          <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping"
          value="sleeping" ${emojiSleepingActive} ${data.isCommentSaving ? 'disabled' : ''}>
        <label class="film-details__emoji-label" for="emoji-sleeping">
          <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke"
          value="puke" ${emojiPukeActive} ${data.isCommentSaving ? 'disabled' : ''}>
        <label class="film-details__emoji-label" for="emoji-puke">
          <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry"
          value="angry" ${emojiAngryActive} ${data.isCommentSaving ? 'disabled' : ''}>
        <label class="film-details__emoji-label" for="emoji-angry">
          <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
        </label>
      </div>
    </div>
  </section>`;
};

export default class CommentBlockView extends SmartView {
  constructor(comments) {
    super();
    this._data = CommentBlockView.parseCommentsToData(comments);

    this.#setInnerHandlers();
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();

    this.element.querySelectorAll('.film-details__comment-delete')
      .forEach((btn) => btn.addEventListener('click', this.#deleteClickHandler));
  }

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.film-details__emoji-label')
      .forEach((select) => select.addEventListener('click', this.#emojiInputHandler));

    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputHandler);
  }

  setViewActionHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelectorAll('.film-details__comment-delete')
      .forEach((btn) => btn.addEventListener('click', this.#deleteClickHandler));
  }

  getNewCommentData = () => ({
    emotion: this._data.commentEmoji,
    comment: this._data.commentText,
  });

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(UserAction.DELETE_COMMENT, UpdateType.MINOR, evt.currentTarget.dataset.id);
  }

  #emojiInputHandler = (evt) => {
    if (this._data.isCommentSaving) {
      return;
    }

    const inputId = evt.currentTarget.getAttribute('for');
    const emoji = this.element.querySelector(`#${inputId}`).value;
    this.updateData({
      commentEmoji: emoji,
    }, false);
  }

  #commentInputHandler = (evt) => {
    this.updateData({
      commentText: evt.target.value,
    }, true);
  }

  get template() {
    return createCommentBlockTemplate(this._data);
  }

  static parseCommentsToData = (comments) => ({
    comments: [...comments],
    commentText: null,
    commentEmoji: null,
    deletingCommentId: null,
    isCommentSaving: false,
  });

  static parseDataToComments = (data) => (data.comments);
}
