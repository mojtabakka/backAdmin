  import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  // @IsNotEmpty({ message: 'لطفا مدل را وارد کنید' })
  model: string;
  brand;
  // @IsNotEmpty({ message: 'لطفا دسته بندی را انتخاب  کنید' })
  category;
  exist: boolean;
  off: number;
  photo: string;
  price: string;
  // @IsNotEmpty({ message: 'لطفا قیمت برای کاربر را وارد  کنید' })
  priceForUser: string;
  // @IsNotEmpty({ message: 'لطفا قیمت برای کاربر را وارد  کنید' })
  priceForWorkmate: string;
  // @IsNotEmpty({ message: 'لطفا تعداد موجودی را وارد  کنید' })
  numberOfExist: number;

  // @IsNotEmpty({ message: 'لطفا روش ارسا را وارد  کنید' })
  deliveryMethod: string;
  properties;
  types;
  warranty: string;
}
