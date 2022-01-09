import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {getRandomInteger, getRandomFromArray, getRandomArray} from '../utils/common';

const generateTitle = () => {
  const titles = [
    'The Dance of Life',
    'Sagebrush Trail',
    'The Man with the Golden Arm',
    'Santa Claus Conquers the Martians',
    'Popeye the Sailor Meets Sindbad the Sailor',
    'The Great Flamarion',
    'Made for Each Other',
  ];

  return getRandomFromArray(titles);
};

const generatePoster = () => {
  const posters = [
    './images/posters/the-dance-of-life.jpg',
    './images/posters/sagebrush-trail.jpg',
    './images/posters/the-man-with-the-golden-arm.jpg',
    './images/posters/santa-claus-conquers-the-martians.jpg',
    './images/posters/popeye-meets-sinbad.png',
    './images/posters/the-great-flamarion.jpg',
    './images/posters/made-for-each-other.png'
  ];

  return getRandomFromArray(posters);
};

const generateDescription = () => {
  const sentences = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.'
  ];

  const MIN_SENTENCE_COUNT = 1;
  const MAX_SENTENCE_COUNT = 5;
  const randomSentencesCount = getRandomInteger(MIN_SENTENCE_COUNT, MAX_SENTENCE_COUNT);
  let description = '';
  for (let i = 0; i < randomSentencesCount; i++) {
    description += getRandomFromArray(sentences);
  }
  return description;
};

const generateComment = () => {
  const authors = [
    'Tim Macoveev',
    'John Do',
  ];

  const messages = [
    'Interesting setting and a good cast',
    'Booooooooooring',
    'Very very old. Meh',
    'Almost two hours? Seriously?',
  ];

  const emotions = [
    'smile',
    'sleeping',
    'puke',
    'angry',
  ];

  const maxSecondsGap = 604800; // 7 дней
  const secondsGap = -1 * getRandomInteger(0, maxSecondsGap);
  const date = dayjs().add(secondsGap, 'second').toDate();

  return {
    id: nanoid(),
    author: getRandomFromArray(authors),
    date,
    message: getRandomFromArray(messages),
    emotion: getRandomFromArray(emotions),
  };
};

const generateComments = () => {
  const MIN_COMMENT_COUNT = 0;
  const MAX_COMMENT_COUNT = 5;
  const commentCount = getRandomInteger(MIN_COMMENT_COUNT, MAX_COMMENT_COUNT);
  const comments = [];
  for (let i = 0; i < commentCount; i++) {
    comments.push(generateComment());
  }
  return comments;
};

const generateGenres = () => {
  const genres = [
    'Musical',
    'Western',
    'Drama',
    'Comedy',
    'Cartoon',
    'Mystery',
  ];
  const MIN_GENRES_COUNT = 1;
  const MAX_GENRES_COUNT = 3;

  return getRandomArray(MIN_GENRES_COUNT, MAX_GENRES_COUNT, genres);
};

const generateDuration = () => (
  getRandomInteger(30, 110)
);

const generateRating = () => (
  (getRandomInteger(0, 100) / 10).toFixed(1)
);

const generateRelease = () => {
  const maxSecondsGap = 1577836800; // 50 лет
  const secondsGap = getRandomInteger(0, maxSecondsGap);
  return dayjs('1920-01-01T16:00:00.000Z').add(secondsGap, 'second').toDate();
};

const generateCountry = () => {
  const countryes = [
    'USA',
    'France',
    'Italy',
    'Russia',
    'Germany',
    'England',
  ];

  return getRandomFromArray(countryes);
};

const generateDirector = () => {
  const directors = [
    'Anthony Mann',
    'John Cromwell',
    'Armand Schaefer',
    'Otto Preminger',
    'Nicholas Webster',
    'Dave Fleischer',
  ];

  return getRandomFromArray(directors);
};

const generateWriters = () => {
  const writerArr = [
    'Anne Wigton',
    'Heinz Herald',
    'Richard Weil',
    'George Manker Watters',
    'Arthur Hopkins',
    'Benjamin Glazer',
    'Lindsley Parsons',
    'Will Beale',
  ];
  const MIN_WRITERS_COUNT = 1;
  const MAX_WRITERS_COUNT = 3;

  return getRandomArray(MIN_WRITERS_COUNT, MAX_WRITERS_COUNT, writerArr);
};

const generateActors = () => {
  const actorArr = [
    'Hal Skelly',
    'Nancy Carroll',
    'Dorothy Revier',
    'John Wayne',
    'Nancy Shubert',
    'Lane Chandler',
    'Frank Sinatra',
  ];
  const MIN_ACTORS_COUNT = 2;
  const MAX_ACTORS_COUNT = 4;

  return getRandomArray(MIN_ACTORS_COUNT, MAX_ACTORS_COUNT, actorArr);
};

const title = generateTitle();

export const generateFilm = () => (
  {
    id: nanoid(),
    title,
    originalTitle: title,
    poster: generatePoster(),
    description: generateDescription(),
    totalRating: generateRating(),
    release: generateRelease(),
    duration: generateDuration(),
    genres: generateGenres(),
    country: generateCountry(),
    ageRating: getRandomInteger(0, 18),
    director: generateDirector(),
    writers: generateWriters(),
    actors: generateActors(),
    comments: generateComments(),
    isAddedToWatchList: Boolean(getRandomInteger()),
    isWatched: Boolean(getRandomInteger()),
    isFavorite: Boolean(getRandomInteger()),
  }
);
