import { IsNotEmpty, isEmpty } from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty({ message: 'وارد کردن برند به زبان فارسی  اجباری است' })
  brand: string;
  @IsNotEmpty({ message: 'وارد کردن برند به زبان انگلیسی  اجباری است' })
  title: string;
}
