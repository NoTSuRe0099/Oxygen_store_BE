import * as fs from 'node:fs/promises';

export const generateSlug = (Text) =>
  Text.toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');

export function getDifference(array1, array2) {
  return array1.filter(
    (object1) =>
      !array2.some((object2) => object1.public_id === object2.public_id)
  );
}

export const clearTempFiles = async (reqImageArr) => {
  await Promise.all(
    await reqImageArr?.map(async (element) => {
      await fs.unlink(element.tempFilePath);
    })
  );
};

// import * as path from 'path';
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
