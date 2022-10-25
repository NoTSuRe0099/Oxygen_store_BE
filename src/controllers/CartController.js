import mongoose from 'mongoose';
import { asyncError } from '../middleware/errorMiddleware.js';
import Cart from '../models/CartSchema.js';

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
  const cart = await Cart.findOne({ userId: req.user._id });
  res.status(200).json({ success: true, data: cart });
});

export const addSingleProduct = asyncError(async (req, res) => {
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

export const addProduct = async () => {};
