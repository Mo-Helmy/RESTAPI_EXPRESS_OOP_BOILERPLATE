import joi from 'joi';

export const userBodySchema = joi.object({
  _id: joi.string().length(14),
  firstName: joi.string().min(3).required(),
  lastName: joi.string().min(3).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).alphanum().required(),
  isStaff: joi.boolean().default(false),
});

export const userQuerySchema = joi.object({
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
