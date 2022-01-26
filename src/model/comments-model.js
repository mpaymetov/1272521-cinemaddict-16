import AbstractObservable from '../utils/abstract-observable.js';
import {nanoid} from 'nanoid';
import dayjs from 'dayjs';
import {UpdateType} from '../const';

export default class CommentsModel extends AbstractObservable {
  #apiService = null;
  #comments = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async () => {
    try {
      this.#comments = await this.#apiService.getComments;
    } catch(err) {
      this.#comments = [];
    }

    //this._notify(UpdateType.INIT);
  };

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
