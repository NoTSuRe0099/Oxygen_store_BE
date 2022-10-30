import mongoose from 'mongoose';
import { asyncError } from '../middleware/errorMiddleware.js';
import Cart from '../models/CartSchema.js';
import Products from '../models/ProductsSchema.js';

export const createCart = asyncError(async (id) => {
  const exists = await Cart.findOne({ userId: id });

  if (!exists) {
    await Cart.create({
      userId: id,
    }).catch((err) => console.error(err));
  }
  return true;
});

export const getUserCart = asyncError(async (req, res) => {
  const cart = await Cart.aggregate([
    {
      $match: { userId: mongoose.Types.ObjectId(req.user._id) },
    },
    {
      $unwind: {
        path: '$cart_items',
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'cart_items.product_id',
        foreignField: '_id',
        as: 'cart_items.product',
      },
    },
    {
      $unwind: {
        path: '$cart_items.product',
      },
    },
    {
      $unset: [
        'cart_items.product.category',
        'cart_items.product.stock',
        'cart_items.product.tags',
        'cart_items.product.__v',
      ],
    },
    // {
    //   $project: {
    //     userId: 1,
    //     cart_items: 1,
    //     total: {
    //       $multiply: ['$cart_items.product.price', '$cart_items.product_qty'],
    //     },
    //   },
    // },
    {
      $group: {
        _id: '$_id',
        userId: {
          $first: '$userId',
        },
        cart_items: {
          $push: '$cart_items',
        },
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    data: cart[0],
  });
});

export const incrementProductQty = asyncError(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });

  if (!cart) {
    return res.status(403).json({
      success: false,
      message: 'user cart not found',
    });
  }

  const itemIndex = cart?.cart_items.findIndex(
    (item) => String(item.product_id) === req?.params?.product_id
  );

  if (Number(itemIndex) >= 0) {
    cart.cart_items[itemIndex].product_qty += 1;

    await cart.save();
    return res
      .status(200)
      .json({ success: true, message: 'item added successfully' });
  }

  cart?.cart_items.push({
    product_id: req?.params?.product_id,
    product_qty: 1,
  });
  await cart.save();
  return res
    .status(200)
    .json({ success: true, message: 'item added successfully' });
});

export const decrementProductQty = asyncError(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });

  if (!cart) {
    return res.status(403).json({
      success: false,
      message: 'user cart not found',
    });
  }

  const itemIndex = cart?.cart_items.findIndex(
    (item) => String(item.product_id) === req?.params?.product_id
  );

  if (Number(itemIndex) >= 0) {
    if (cart.cart_items[itemIndex].product_qty > 1) {
      cart.cart_items[itemIndex].product_qty -= 1;

      await cart.save();
      return res
        .status(200)
        .json({ success: true, message: 'item quantity updated' });
    }
  }
});

export const removeProduct = asyncError(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });

  if (!cart) {
    return res.status(403).json({
      success: false,
      message: 'user cart not found',
    });
  }

  const itemIndex = cart?.cart_items.findIndex(
    (item) => String(item.product_id) === req?.params?.product_id
  );

  if (Number(itemIndex) >= 0) {
    cart.cart_items.splice(itemIndex, 1);
    await cart.save();
    return res
      .status(200)
      .json({ success: true, message: 'item removed successfully' });
  }
});
