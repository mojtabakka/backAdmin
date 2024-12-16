import { IsNotEmpty, MinLength } from 'class-validator';

export class editddressDto {
  @IsNotEmpty({ message: 'لطفا آدرس را وارد کنید' })
  address?: string;

  @IsNotEmpty({ message: 'لطفا نام استان  را وارد کنید' })
  state?: string;
  district?: string;

  @IsNotEmpty({ message: 'لطفا نام شهر  را وارد کنید' })
  city: string;

  @IsNotEmpty({ message: 'لطفا پلاک  را وارد کنید' })
  plaque: string;
  unit: string;

  @MinLength(10, { message: 'کدپستی  باید ۱۰ رقم باشد' })
  @MinLength(10, { message: 'کدپستی  باید ۱۰ رقم باشد' })
  postalCode: string;

  receivername: string;
  receiverlastname: string;
  recivermobile: string;
}
