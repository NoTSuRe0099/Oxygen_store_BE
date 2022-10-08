import Joi from 'joi';

export const categorySchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  description: Joi.string().min(3).max(2000).required(),
  slug: Joi.string().min(3).max(30),
  tags: Joi.array().items(Joi.string()),
});

export const productsSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  description: Joi.string().min(3).max(2000).required(),
  slug: Joi.string().min(3).max(30),
  tags: Joi.array().items(Joi.string()),
  price: Joi.number().min(0).required(),
  category: Joi.string().required(),
  stock: Joi.number().required().min(0).max(10000),
});
