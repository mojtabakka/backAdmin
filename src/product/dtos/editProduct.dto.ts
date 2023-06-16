import { IsNotEmpty } from 'class-validator';

export class EditProductDto {
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
}
