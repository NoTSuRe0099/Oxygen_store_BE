import productsModel from '../models/ProductsSchema.js';
import { generateSlug, getDifference } from '../utils/utils.js';
import { productsSchema } from '../Validators/index.js';
import Cloudinary from 'cloudinary';
import { asyncError } from '../middleware/errorMiddleware.js';
const cloudinary = Cloudinary.v2;

//* Create Product ---> Admin
export const create = asyncError(async (req, res, next) => {
  const data = await productsSchema.validateAsync(req?.body);

  let reqImageArr = [];
  const imagesArr = [];

  if (data)
    if (!req?.files?.images)
      return res.status(400).json({
        success: false,
        messasge: 'Please provide image in images*',
      });

  let slug;

  if (data?.slug) {
    slug = data?.slug;
  } else {
    slug = generateSlug(data?.name);
  }

  const exists = await productsModel
    .findOne({ name: data?.name, slug })
    .catch((err) => {
      res.status(400).json({
        success: false,
        messasge: err,
      });
    });

  if (!exists) {
    if (!req?.files?.images?.name) {
      reqImageArr = req?.files?.images;
    } else {
      reqImageArr.push(req?.files?.images);
    }

    for (const image of reqImageArr) {
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: 'Oxygen-store/products',
      });

      imagesArr.push({
        public_id: result?.public_id,
        url: result?.secure_url,
      });
    }

    return await productsModel
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

//* Get All Products
export const getAllProducts = asyncError(async (req, res, next) => {
  const data = await productsModel.find().catch((err) => {
    res.status(400).json({
      success: false,
    });
  });

  return res.status(200).json({
    success: true,
    data,
  });
});

//* Update Products ---> Admin
export const update = asyncError(async (req, res, next) => {
  let reqImageArr = [];
  let imagesArr = [];

  const exists = await productsModel.findById(req?.params?.id).catch((err) => {
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
          folder: 'Oxygen-store/products',
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

    const product = await productsModel
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
      data: product,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: 'Product Not Found',
    });
  }
});

//* Delete Category ---> Admin
export const deleteProduct = asyncError(async (req, res, next) => {
  const exists = await productsModel.findById(req?.params?.id).catch((err) => {
    return res.status(500).json({
      success: false,
      message: err?.message,
    });
  });

  if (!exists) {
    return res.status(404).json({
      success: false,
      message: 'Product Not Found',
    });
  }

  await productsModel.findByIdAndDelete(req?.params?.id).catch((err) => {
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
    message: `Deleted Product: ${exists?.name}`,
    data: exists,
  });
});

//* Get Single Products
export const getSingleProduct = asyncError(async (req, res, next) => {
  const exists = await productsModel.findById(req?.params?.id).catch((err) => {
    return res.status(500).json({
      success: false,
      message: err?.message,
    });
  });

  if (!exists) {
    return res.status(404).json({
      success: false,
      message: 'Product Not Found',
    });
  }

  return res.status(200).json({
    success: true,
    data: exists,
  });
});
