import { IsNotEmpty, isEmpty } from 'class-validator';

export class CreateCatDto {
  @IsNotEmpty({ message: 'لطفا دسته موردنظر را وارد کنید' })
  type: string;
  brands: Array<object>;
  types: Array<object>;
  properties: Array<object>;
  photo:string
}
