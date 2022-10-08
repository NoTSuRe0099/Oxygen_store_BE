import { asyncError } from '../middleware/errorMiddleware.js';
import categoryModel from '../models/CategorySchema.js';
import { categorySchema } from '../Validators/index.js';
import Cloudinary from 'cloudinary';
import { generateSlug, getDifference } from '../utils/utils.js';
const cloudinary = Cloudinary.v2;

//* Create Category ---> Admin
export const create = asyncError(async (req, res, next) => {
  const data = await categorySchema.validateAsync(req?.body);

  let reqImageArr = [];
  const imagesArr = [];

  if (data)
    if (!req?.files?.images)
      return res.status(400).json({
        success: false,
        messasge: 'Please provide image in category_image*',
      });

  let slug;

  if (data?.slug) {
    slug = data?.slug;
  } else {
    slug = generateSlug(data?.name);
  }

  const Exists = await categoryModel
    .findOne({ name: data?.name, slug })
    .catch((err) => {
      res.status(400).json({
        success: false,
        messasge: err,
      });
    });

  if (!Exists) {
    if (!req?.files?.images?.name) {
      reqImageArr = req?.files?.images;
    } else {
      reqImageArr.push(req?.files?.images);
    }

    for (const image of reqImageArr) {
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: 'Oxygen-store/category',
      });

      imagesArr.push({
        public_id: result?.public_id,
        url: result?.secure_url,
      });
    }

    return await categoryModel
      .create({
        ...data,
        slug,
        images: imagesArr,
      })
      .then((cat) => {
        res.status(201).json(cat);
      });
  } else {
    return res.status(400).json({
      success: false,
      messasge: `"${data?.name}" Already exists`,
    });
  }
});

//* Get all Categories
export const getAllCategories = asyncError(async (req, res, next) => {
  const data = await categoryModel.find().catch((err) => {
    res.status(400).json({
      success: false,
    });
  });

  return res.status(200).json({
    success: true,
    data,
  });
});

//* Update Category ---> Admin
export const update = asyncError(async (req, res, next) => {
  let reqImageArr = [];
  let imagesArr = [];

  const exists = await categoryModel.findById(req?.params?.id).catch((err) => {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  });

  if (exists) {
    if (req?.files?.images) {
      if (!req?.files?.images?.name) {
        reqImageArr = req?.files?.images;
      } else {
        reqImageArr.push(req?.files?.images);
      }

      for (const image of reqImageArr) {
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
          folder: 'Oxygen-store/category',
        });

        imagesArr.push({
          public_id: result?.public_id,
          url: result?.secure_url,
        });
      }
    }

    if (
      req?.body?.images &&
      req?.body?.images?.length < exists?.images?.length
    ) {
      const deleteOldImages = getDifference(req?.body?.images, exists?.images);

      if (deleteOldImages?.length > 0) {
        for (const iamge of deleteOldImages) {
          await cloudinary.uploader.destroy(iamge?.public_id);
        }
      }
    }

    let updatedImages = req?.body?.images
      ? [...req?.body?.images]
      : exists?.images;

    const slug = req?.body?.slug
      ? req?.body?.slug
      : generateSlug(req?.body?.name ? req?.body?.name : exists?.name);

    const category = await categoryModel
      .findByIdAndUpdate(
        req?.params?.id,

        { ...req?.body, slug, images: [...updatedImages, ...imagesArr] },
        {
          new: true,
        }
      )
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: err?.message,
        });
      });

    return res.status(200).json({
      success: true,
      data: category,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: 'Category Not Found',
    });
  }
});

//* Delete Category ---> Admin
export const deleteCategory = asyncError(async (req, res, next) => {
  const exists = await categoryModel.findById(req?.params?.id).catch((err) => {
    return res.status(500).json({
      success: false,
      message: err?.message,
    });
  });

  if (!exists) {
    return res.status(404).json({
      success: false,
      message: 'Category Not Found',
    });
  }

  await categoryModel.findByIdAndDelete(req?.params?.id).catch((err) => {
    return res.status(500).json({
      success: false,
      message: err?.message,
    });
  });

  if (exists?.images.length > 0) {
    for (const image of exists?.images) {
      await cloudinary.uploader.destroy(image?.public_id);
    }
  }

  return res.status(202).json({
    success: true,
    message: `Deleted Category: ${exists?.name}`,
    data: exists,
  });
});

export const getSingleCategory = asyncError(async (req, res, next) => {
  const exists = await categoryModel.findById(req?.params?.id).catch((err) => {
    return res.status(500).json({
      success: false,
      message: err?.message,
    });
  });

  if (!exists) {
    return res.status(404).json({
      success: false,
      message: 'Category Not Found',
    });
  }

  return res.status(200).json({
    success: true,
    data: exists,
  });
});
