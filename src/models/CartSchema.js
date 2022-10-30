import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },

    cart_items: [
      {
        required: false,
        product_id: {
          type: mongoose.Types.ObjectId,
          required: true,
        },
        product_qty: {
          type: Number,
          required: true,
          default: 0,
        },
        _id: false,
      },
    ],
  },
  {
    timestamps: true,
    strict: true,
  }
);

export default mongoose.model('Cart', CartSchema);
