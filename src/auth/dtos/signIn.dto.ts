import { IsNotEmpty } from 'class-validator';

export class SigninDto {
  @IsNotEmpty({ message: 'لطفا نام کاربری را وارد کنید' })
  phoneNumber: string;
  @IsNotEmpty({ message: 'لطفا رمز عبور را وارد کنید' })
  password: string;
}
