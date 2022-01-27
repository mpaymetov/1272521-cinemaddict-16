const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get films() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this.#load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  getComments = async (filmId) => (
    this.#load({url: `comments/${filmId}`})
      .then(ApiService.parseResponse)
  )

  addComment = async (commentData) => {
    const response = await this.#load({
      url: `comments/${commentData.filmId}`,
      method: Method.POST,
      body: JSON.stringify(commentData.comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  deleteComment = async (comment) => {
    const response = await this.#load({
      url: `comments/${comment.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #adaptToServer = (film) => {
    const releaseData = {
      'date': film.release,
      'release_country': film.country,
    };
    const filmInfoData = {
      'release': releaseData,
      'actors': film.actors,
      'age_rating': film.ageRating,
      'total_rating': film.totalRating,
      'title': film.title,
      'alternative_title': film.originalTitle,
      'description': film.description,
      'director': film.director,
      'genre': film.genres,
      'poster': film.poster,
      'writers': film.writers,
      'runtime': film.duration,
    };
    const userDetailsData = {
      'watchlist': film.isAddedToWatchList,
      'favorite': film.isFavorite,
      'already_watched': film.isWatched,
      'watching_date': film.watchingDate,
    };

    const adaptedFilm = {...film,
      'film_info': filmInfoData,
      'user_details': userDetailsData,
    };

    delete adaptedFilm.isFavorite;
    delete adaptedFilm.isAddedToWatchList;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.watchingDate;
    delete adaptedFilm.actors;
    delete adaptedFilm.ageRating;
    delete adaptedFilm.totalRating;
    delete adaptedFilm.title;
    delete adaptedFilm.originalTitle;
    delete adaptedFilm.description;
    delete adaptedFilm.director;
    delete adaptedFilm.genres;
    delete adaptedFilm.poster;
    delete adaptedFilm.writers;
    delete adaptedFilm.duration;
    delete adaptedFilm.release;
    delete adaptedFilm.country;

    return adaptedFilm;
  };

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  };

  static catchError = (err) => {
    throw err;
  };
}
