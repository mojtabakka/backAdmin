import { type } from 'os';

export type userOfPayload = {
  username: string;
};

export type CreateProductDetial = {
  brand;
  category;
  deliveryMethod: string;
  exist: boolean;
  model: string;
  numberOfExist: number;
  off: number;
  photo: string;
  price: string;
  priceForUser: string;
  priceForWorkmate: string;
  properties;
  types;
  warranty: string;
};
export type GetProductsDetail = {
  type: string;
  brand: string;
  catId: Number;
  properties;
};

export type EditProduct = {
  brand;
  category;
  deliveryMethod: string;
  exist: boolean;
  id: number;
  model: string;
  numberOfExist: string;
  off: number;
  photo: string;
  price: string;
  priceForUser: string;
  priceForWorkmate: string;
  properties;
  types;
  warranty: string;
};
