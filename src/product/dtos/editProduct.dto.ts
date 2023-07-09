import { IsNotEmpty } from 'class-validator';

export class EditProductDto {
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
}
