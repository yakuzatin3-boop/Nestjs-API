import { ProductStatus } from "../enums/product-status.enum";

export interface IProductSpecifications {

  screen?: string;

  processor?: string;

  ram?: string;

  storage?: string;

  battery?: string;

  operatingSystem?: string;

}

export interface IProduct {

  name: string;

  description?: string;

  price: number;

  stock: number;

  images: string[];

  category?: string;

  brand?: string;

  specifications?: IProductSpecifications;

  status: ProductStatus;

  featured?: boolean;

  bestSeller?: boolean;

  flashSale?: boolean;

  createdAt?: Date;

  updatedAt?: Date;
}