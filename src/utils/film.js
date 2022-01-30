import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import {FILM_CARD_DESCRIPTION_MAX} from '../const';

export const capitalizeFirstLetter = (str) => (str[0].toUpperCase() + str.slice(1));

export const getReleaseDate = (date) => dayjs(date).format('D MMMM YYYY');

export const getReleaseYear = (date) => dayjs(date).format('YYYY');

export const getCommentDate = (date) => dayjs(date).format('YYYY/M/D H:mm');

export const getDurationString = (minutes) => {
  if (minutes < 60) {
    return dayjs.duration(minutes, 'minutes').format('m[m]');
  }
  return dayjs.duration(minutes, 'minutes').format('H[h] m[m]');
};

export const sortDate = (filmA, filmB) => (
  dayjs(filmB.release).diff(dayjs(filmA.release))
);

export const sortRating = (filmA, filmB) => {
  const ratingA = parseFloat(filmA.totalRating);
  const ratingB = parseFloat(filmB.totalRating);

  if (ratingA < ratingB) {
    return 1;
  }

  if (ratingA > ratingB) {
    return -1;
  }

  return 0;
};

export const sortComment = (filmA, filmB) => {
  const commentsA = filmA.comments.length;
  const commentsB = filmB.comments.length;

  if (commentsA < commentsB) {
    return 1;
  }

  if (commentsA > commentsB) {
    return -1;
  }

  return 0;
};

export const trimDescription = (text) => {
  if (text.length > FILM_CARD_DESCRIPTION_MAX) {
    const trimedDescription = text.slice(0, FILM_CARD_DESCRIPTION_MAX - 2);
    const description = trimedDescription.concat('&hellip;');
    return description;
  }
  return text;
};
