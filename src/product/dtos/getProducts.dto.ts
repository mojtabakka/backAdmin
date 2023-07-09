import { IsNotEmpty } from 'class-validator';

export class GetProductsDto {
  type: string;
  brand: string;
  catId: number;
  properties;
}
