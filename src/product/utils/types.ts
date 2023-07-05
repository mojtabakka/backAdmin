export type userOfPayload = {
  username: string;
};

export type CreateProductDetial = {
  brands;
  categories;
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

export type EditProduct = {
  id: number;
  deliveryMethod: string;
  numberOfExist: string;
  warranty: string;
  model: string;
  price: string;
  features: string;
  priceForUser: string;
  priceForWorkmate: string;
  exist: boolean;
  off: number;
  categories;
  brands;
  types;
  properties;
};
