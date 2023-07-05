import { IsNotEmpty, isEmpty } from 'class-validator';

export class CreateTypeDto {
  @IsNotEmpty({ message: 'وارد کردن نوع محصول به زبان فارسی  اجباری است' })
  type: string;
  @IsNotEmpty({ message: 'وارد کردن نوع محصول به زبان انگلیسی  اجباری است' })
  title: string;
}
