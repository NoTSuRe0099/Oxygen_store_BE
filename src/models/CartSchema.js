import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema(
  {
    cart_user: {
      type: String,
      required: true,
      ref: 'User',
      unique: true,
    },

    cart_items: [
      {
        product_id: {
          type: String,
          required: true,
        },
        // product_name: {
        //   type: String,
        //   required: true,
        // },
        // product_price: {
        //   type: Number,
        //   required: true,
        // },
        product_qty: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Cart', CartSchema);
