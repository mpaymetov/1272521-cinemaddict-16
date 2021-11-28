import dayjs from 'dayjs';

export const getRandomInteger = (min = 0, max = 1) => {
  if (min < 0) {
    return false;
  }
  if (max <= min) {
    return min;
  }
  return Math.round((max - min) * Math.random() + min);
};

export const getRandomFromArray = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);
  return array[randomIndex];
};

export const capitalizeFirstLetter = (str) => (str[0].toUpperCase() + str.slice(1));

export const getReleaseDate = (date) => dayjs(date).format('D MMMM YYYY');

export const getReleaseYear = (date) => dayjs(date).format('YYYY');

export const getCommentDate = (date) => dayjs(date).format('YYYY/M/D H:mm');
