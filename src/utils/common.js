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

export const getRandomArray = (MIN_COUNT, MAX_COUNT, arrayFrom) => {
  const randomCount = getRandomInteger(MIN_COUNT, MAX_COUNT);
  const result = [];
  for (let i = 0; i < randomCount; i++) {
    result.push(getRandomFromArray(arrayFrom));
  }
  return result;
};
