import { Collection, Document, InsertOneResult, ObjectId, OptionalId, Sort, SortDirection, WithoutId } from 'mongodb';
import client from '../mongodb';

export abstract class ModelStoreBase<ModelType> {
  protected document: Collection<Document>;

  pkQuery(pk: string) {
    return { [this.pk]: this.pk === '_id' ? new ObjectId(pk) : pk };
  }

  constructor(
    protected collection: string,
    protected pk: string,
    protected slug?: string,
    protected pagination?: number
  ) {
    this.document = client.db().collection(this.collection);
  }

  /**
   * to apply filtering you must override this method
   * @param page [optional] default 1
   * @param pageSize [optional] default class pagination
   * @param sort [optional] default '_id'
   * @param dir [optional] default 1
   * @param filter [optional] can be added by override model and override handler
   */
  async list(page?: number, pageSize?: number, sort?: Sort, dir?: SortDirection, filter?) {
    console.log('🚀 ~ file: modelBase.ts:16 ~ ModelStoreBase<ModelType> ~ list ~ filter:', filter);
    try {
      if (this.pagination) {
        const ps = pageSize || this.pagination;

        const items = await this.document
          .find(filter)
          .limit(ps)
          .skip(((page || 1) - 1) * ps)
          .sort(sort || '_id', dir || 1)
          .toArray();

        const itemsCount = await this.document.countDocuments(filter);

        const pagesCount = Math.ceil(itemsCount / ps);

        return {
          hasNext: (page || 1) < pagesCount,
          hasPrev: (page || 1) > 1 && pagesCount > 1,
          pagesCount,
          itemsCount,
          items,
        };
      }

      const result = await this.document.find().toArray();
      return result;
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }

  async create(object: ModelType): Promise<InsertOneResult<Document> | any> {
    try {
      const slug = this.slug ? object[this.slug].replaceAll(' ', '-') + '-' + new Date().getTime() : null;
      const result = await this.document.insertOne((slug ? { ...object, slug } : object) as OptionalId<Document>);
      return result;
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }

  async retrive(pk: string) {
    try {
      const result = await this.document.find(this.pkQuery(pk)).toArray();
      return result;
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }

  async update(pk: string, object: ModelType) {
    try {
      const result = await this.document.findOneAndReplace(this.pkQuery(pk), object as WithoutId<Document>);
      return result;
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }

  async partialUpdate(pk: string, object: Document) {
    try {
      const result = await this.document.findOneAndUpdate(this.pkQuery(pk), { $set: object });
      return result;
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }

  async delete(pk: string) {
    try {
      const result = await this.document.findOneAndDelete(this.pkQuery(pk));
      return result;
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }
}
