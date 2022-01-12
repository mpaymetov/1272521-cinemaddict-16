import AbstractObservable from '../utils/abstract-observable.js';
import {nanoid} from 'nanoid';
import dayjs from 'dayjs';

export default class CommentsModel extends AbstractObservable {
  #comments = [];

  set comments(comments) {
    this.#comments = [...comments];
  }

  get comments() {
    return this.#comments;
  }

  addComment = (updateType, update, updateFrom) => {
    const newComment = {
      id: nanoid(),
      author: 'Super Admin',
      date: dayjs().toDate(),
      ...update
    };
    this.#comments = [
      ...this.#comments,
      newComment,
    ];

    this._notify(updateType, updateFrom);
  }

  deleteComment = (updateType, update, updateFrom) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType, updateFrom);
  }
}
