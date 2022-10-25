import mongoose from 'mongoose';

const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
    required: true,
    unique: true,
  },

  price: {
    type: Number,
    required: [true, 'Product Price is Required*'],
  },

  images: {
    type: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        required: false,
      },
    ],
    required: false,
  },

  category: {
    type: String,
    required: [true, 'Category id is Required*'],
  },

  stock: {
    type: Number,
    required: [true, 'Please Enter product Stock'],
    maxLength: [4, 'Stock cannot exceed 4 characters'],
    default: 1,
  },

  tags: {
    type: [String],
    required: false,
  },

  discount: {
    type: Number,
    required: false,
  },
});

export default mongoose.model('Products', productsSchema);
