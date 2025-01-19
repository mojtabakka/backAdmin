import { type } from 'os';

export type userOfPayload = {
  username: string;
};

export type CreateProductDetail = {
  model: string;
  category: string;
  brand: string;
  types: string;
  priceForUser: string;
  priceForWorkmate: string;
  warranty: string;
  numberOfExist: string;
  off: string;
  photo: string;
  properties: Array<{
    id: string;
    value: string;
  }>;
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
