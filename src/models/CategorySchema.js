import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'category name is required'],
      unique: [true, 'category name should be unique*'],
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

    description: {
      type: String,
      required: false,
    },

    slug: {
      type: String,
      unique: true,
    },

    tags: {
      type: [String],
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
