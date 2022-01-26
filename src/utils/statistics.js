import {DurationType} from '../const';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
dayjs.extend(isToday);
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

export const getUserRank = (filmsCount) => {
  if (filmsCount > 20) {
    return 'Movie buff';
  } else if (filmsCount > 10) {
    return 'Fan';
  } else if (filmsCount > 0) {
    return 'Novice';
  } else {
    return '';
  }
};

export const getFilmsDurations = (films) => {
  let sum = 0;
  for (const film of films) {
    sum +=  film.duration;
  }
  return sum;
};

export const getGenres = (films) => {
  const genres = [];
  for (const film of films) {
    for (const genre of film.genres) {
      const index = genres.findIndex((element) => element.genreName === genre);
      if (index === -1) {
        genres.push({
          genreName: genre,
          genreCount: 1
        });
      } else {
        genres[index].genreCount++;
      }
    }
  }

  return genres.sort((a, b) => b.genreCount - a.genreCount);
};

export const getTopGenre = (films) => {
  const genres = getGenres(films);
  if (!genres.length) {
    return '';
  }
  return genres[0].genreName;
};

export const filterByWatchingDate = (films, durationType) => {
  if (durationType === DurationType.ALL_TIME) {
    return films;
  }

  if (durationType === DurationType.TODAY) {
    return films.filter((film) => dayjs(film.watchingDate).isToday());
  }

  return films.filter((film) => dayjs(film.watchingDate).isSameOrAfter(dayjs().add(-1, durationType)));
};
