export type userOfPayload = {
  username: string;
};

export type CreateProduct = {
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
};
