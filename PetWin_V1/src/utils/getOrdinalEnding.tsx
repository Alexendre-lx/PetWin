export const getOrdinalEnding = (place: number): string => {
  if (place % 10 === 1 && place !== 11) {
    return place + 'st';
  } else if (place % 10 === 2 && place !== 12) {
    return place + 'nd';
  } else if (place % 10 === 3 && place !== 13) {
    return place + 'rd';
  } else {
    return place + 'th';
  }
};
