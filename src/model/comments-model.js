import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../const';

export default class CommentsModel extends AbstractObservable {
  #apiService = null;
  #comments = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async (film) => {
    try {
      this.#comments = await this.#apiService.getComments(film.id);
    } catch(err) {
      this.#comments = [];
    }

    this._notify(UpdateType.PATCH, film);
  };

  get comments() {
    return this.#comments;
  }

  addComment = async (updateType, update, updateFrom) => {
    try {
      const response = await this.#apiService.addComment(update, updateFrom);
      this.#comments = response.comments;

      const commentsId = this.#getCommentsId();
      const film = {
        ...updateFrom,
        comments: commentsId
      };

      this._notify(updateType, film);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  }

  #getCommentsId = () => {
    const result = [...new Set(this.#comments.map((p) => p.id))];
    return result;
  }

  deleteComment = async (updateType, update, updateFrom) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#apiService.deleteComment(update);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];

      const commentsId = this.#getCommentsId();
      const film = {
        ...updateFrom,
        comments: commentsId
      };

      this._notify(updateType, film);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  }
}
