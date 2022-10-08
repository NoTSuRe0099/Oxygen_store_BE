export const generateSlug = (Text) => {
  return Text.toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

export function getDifference(array1, array2) {
  return array1.filter((object1) => {
    return !array2.some((object2) => {
      return object1.public_id === object2.public_id;
    });
  });
}
