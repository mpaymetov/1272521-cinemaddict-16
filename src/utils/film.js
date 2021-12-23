import dayjs from 'dayjs';

export const capitalizeFirstLetter = (str) => (str[0].toUpperCase() + str.slice(1));

export const getReleaseDate = (date) => dayjs(date).format('D MMMM YYYY');

export const getReleaseYear = (date) => dayjs(date).format('YYYY');

export const getCommentDate = (date) => dayjs(date).format('YYYY/M/D H:mm');

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
