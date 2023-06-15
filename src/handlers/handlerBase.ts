import { Request, Response } from 'express';
import { ModelStoreBase } from '../models/modelBase';
import { SortDirection } from 'mongodb';
import { ObjectSchema } from 'joi';

export abstract class HandlerBase<ModelType, ModelStoreType extends ModelStoreBase<ModelType>> {
  protected store: ModelStoreType;
  validator(schema: ObjectSchema<any>, payload: any) {
    return schema.validate(payload, { abortEarly: false });
  }

  /**
   * @constructor
   * @param {ModelStoreType} type Store type (user, orders, etc.).
   */
  constructor(
    type: { new (): ModelStoreType },
    protected validationBodySchema: ObjectSchema<any>,
    protected validationQuerySchema: ObjectSchema<any>
  ) {
    this.store = new type();
  }

  async list(req: Request, res: Response) {
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

      const result = await this.store.list(page, pageSize, sort, dir);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { error, value } = this.validator(this.validationBodySchema, req.body);
      if (error) {
        res.status(400).json({ error });
        return;
      }
      const result = await this.store.create(value);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async retrive(req: Request, res: Response) {
    try {
      const result = await this.store.retrive(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { error, value } = this.validator(this.validationBodySchema, req.body);
      if (error) {
        res.status(400).json({ error });
        return;
      }
      const result = await this.store.update(req.params.id, value);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async partialUpdate(req: Request, res: Response) {
    try {
      const result = await this.store.partialUpdate(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const result = await this.store.delete(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
