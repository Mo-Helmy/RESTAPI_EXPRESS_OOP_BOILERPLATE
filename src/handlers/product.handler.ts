import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { Product, ProductStore } from '../models/product';
import { HandlerBase } from './handlerBase';
import { SortDirection } from 'mongodb';
import { productBodySchema, productQuerySchema } from '../validators/product';

export default class ProductHandler extends HandlerBase<Product, ProductStore> {
  constructor() {
    super(ProductStore, productBodySchema, productQuerySchema);
  }

  override async list(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    try {
      const { error, value } = this.validator(this.validationQuerySchema, req.query);
      if (error) {
        res.status(400).json({ error });
        return;
      }
      const page = +(req.query.page as string) || 1;
      const pageSize = +(req.query.pageSize as string);
      const sort = req.query.sort as string;
      const dir = req.query.dir as SortDirection;

      const result = await this.store.list(
        page,
        pageSize,
        sort,
        dir,
        req.query.name as string,
        req.query.price as string,
        req.query.category as string
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
