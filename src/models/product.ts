import { InsertOneResult, Document, WithId, Sort, SortDirection } from 'mongodb';
import { ModelStoreBase } from './modelBase';

export type Product = {
  _id?: string;
  name: string;
  price: number;
  category: string;
};

export class ProductStore extends ModelStoreBase<Product> {
  constructor() {
    super('producs', 'slug', 'name', 2);
  }

  override async list(
    page: number,
    pageSize?: number | undefined,
    sort?: Sort | undefined,
    dir?: SortDirection | undefined,
    name?: string,
    price?: string,
    category?: string
  ): Promise<
    | WithId<Document>[]
    | { hasNext: boolean; hasPrev: boolean; pagesCount: number; itemsCount: number; items: WithId<Document>[] }
  > {
    let filter: { [s: string]: string } = {};
    name && (filter.name = name);
    price && (filter.price = price);
    category && (filter.category = category);

    console.log('🚀 ~ file: product.ts:30 ~ ProductStore ~ filter:', filter);

    return super.list(page, pageSize, sort, dir, filter);
  }
}
