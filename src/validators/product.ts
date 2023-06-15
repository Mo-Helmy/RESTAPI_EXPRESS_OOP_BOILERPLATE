import joi from 'joi';

export const productBodySchema = joi.object({
  _id: joi.string().length(14),
  name: joi.string().min(3).required(),
  price: joi.number().greater(0).required(),
  category: joi.string().min(3).required(),
});

export const productQuerySchema = joi.object({
  page: joi.number(),
  pageSize: joi.number().less(101),
  //   sort: joi.string().allow(['name', 'price', 'categroy']),
  //   dir: joi.allow([1, -1, 'asc', 'desc']),
  sort: joi.string().allow('name', 'price', 'categroy'),
  dir: joi.string(),
  name: joi.string().min(3),
  price: joi.number().greater(0),
  category: joi.string().min(3),
});
