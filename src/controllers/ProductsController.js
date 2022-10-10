import Cloudinary from 'cloudinary';
import productsModel from '../models/ProductsSchema.js';
import { clearTempFiles, generateSlug, getDifference } from '../utils/utils.js';
import { productsSchema } from '../Validators/index.js';
import { asyncError } from '../middleware/errorMiddleware.js';

const cloudinary = Cloudinary.v2;

//* Create Product ---> Admin
export const createProduct = asyncError(async (req, res) => {
  const data = await productsSchema.validateAsync(req?.body);

  if (data) {
    let reqImageArr = [];
    const imagesArr = [];

    if (!req?.files?.images) {
      return res.status(400).json({
        success: false,
        messasge: 'Please provide image in images*',
      });
    }

    if (!req?.files?.images?.name) {
      reqImageArr = req?.files?.images;
    } else {
      reqImageArr.push(req?.files?.images);
    }

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
      // (async (arr) => {
      await Promise.all(
        await reqImageArr?.map(async (image) => {
          const result = await cloudinary.uploader.upload(image.tempFilePath, {
            folder: 'Oxygen-store/products',
          });

          imagesArr.push({
            public_id: result?.public_id,
            url: result?.secure_url,
          });
        })
      );

      // })(reqImageArr);

      await clearTempFiles(reqImageArr);
      const product = await productsModel
        .create({
          ...data,
          slug,
          images: imagesArr,
        })
        .then((cat) => {
          res.status(201).json(cat);
        });

      return product;
    }
    await clearTempFiles(reqImageArr);

    return res.status(400).json({
      success: false,
      messasge: `"${data?.name}" Already exists`,
    });
  }
  return true;
});

//* Get All Products
export const getAllProducts = asyncError(async (req, res) => {
  const data = await productsModel.find().catch(() => {
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
export const updateProduct = asyncError(async (req, res) => {
  let reqImageArr = [];
  const imagesArr = [];

  const exists = await productsModel
    .findById(req?.params?.id)
    .catch(async (err) => {
      await clearTempFiles(reqImageArr);
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

      await Promise.all(
        await reqImageArr?.map(async (image) => {
          const result = await cloudinary.uploader.upload(image.tempFilePath, {
            folder: 'Oxygen-store/products',
          });

          imagesArr.push({
            public_id: result?.public_id,
            url: result?.secure_url,
          });
        })
      );

      // ?old loop ----->
      // for (const image of reqImageArr) {
      //   const result = await cloudinary.uploader.upload(image.tempFilePath, {
      //     folder: 'Oxygen-store/products',
      //   });

      //   imagesArr.push({
      //     public_id: result?.public_id,
      //     url: result?.secure_url,
      //   });
      // }
    }

    if (
      req?.body?.images &&
      req?.body?.images?.length < exists?.images?.length
    ) {
      const deleteOldImages = getDifference(req?.body?.images, exists?.images);

      if (deleteOldImages?.length > 0) {
        await Promise.all(
          await deleteOldImages?.map(async (iamge) => {
            await cloudinary.uploader.destroy(iamge?.public_id);
          })
        );

        // for (const iamge of deleteOldImages) {
        //   await cloudinary.uploader.destroy(iamge?.public_id);
        // }
      }
    }

    const updatedImages = req?.body?.images
      ? [...req.body.images]
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
      .catch(async (err) => {
        await clearTempFiles(reqImageArr);
        return res.status(500).json({
          success: false,
          message: err?.message,
        });
      });

    await clearTempFiles(reqImageArr);
    return res.status(200).json({
      success: true,
      data: product,
    });
  }
  await clearTempFiles(reqImageArr);
  return res.status(404).json({
    success: false,
    message: 'Product Not Found',
  });
});

//* Delete Category ---> Admin
export const deleteProduct = asyncError(async (req, res) => {
  const exists = await productsModel.findById(req?.params?.id).catch((err) =>
    res.status(500).json({
      success: false,
      message: err?.message,
    })
  );

  if (!exists) {
    return res.status(404).json({
      success: false,
      message: 'Product Not Found',
    });
  }

  await productsModel.findByIdAndDelete(req?.params?.id).catch((err) =>
    res.status(500).json({
      success: false,
      message: err?.message,
    })
  );

  if (exists?.images.length > 0) {
    await Promise.all(
      await exists?.images?.map(async (iamge) => {
        await cloudinary.uploader.destroy(iamge?.public_id);
      })
    );

    // ?Old loop --------->
    // for (const image of exists?.images) {
    //   await cloudinary.uploader.destroy(image.public_id);
    // }
  }
  return res.status(202).json({
    success: true,
    message: `Deleted Product: ${exists?.name}`,
    data: exists,
  });
});

//* Get Single Products
export const getSingleProduct = asyncError(async (req, res) => {
  const exists = await productsModel.findById(req?.params?.id).catch((err) =>
    res.status(500).json({
      success: false,
      message: err?.message,
    })
  );

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
