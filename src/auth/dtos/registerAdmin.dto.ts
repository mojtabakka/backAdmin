import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  length,
  minLength,
} from 'class-validator';

export class RegisterAdminDto {
  @IsNotEmpty({ message: 'لطفا نام را وارد کنید' })
  name: string;
  @IsNotEmpty({ message: 'لطفا نام خانوادگی را وارد کنید' })
  lastName: string;
  @IsNotEmpty({ message: 'لطفا کدملی را وارد کنید' })
  @MinLength(10, { message: 'کدملی  باید ۱۰ رقم باشد' })
  @MinLength(10, { message: 'کذملی  باید ۱۰ رقم باشد' })
  nationalCode: string;

  @IsNotEmpty({ message: 'لطفا شماره تماس  را وارد کنید' })
  @MinLength(11, { message: 'شماره تماس باید ۱۱ رقم باشد' })
  @MinLength(1, { message: 'شماره تماس باید ۱۱ رقم باشد' })
  phoneNumber: string;
  username: string;
  @IsNotEmpty({ message: 'لطفا ایمیل را وارد کنید' })
  @IsEmail(undefined, {
    message: "لطفا ایمل را به درستی وارد کنید"
  })
  email: string;
  @IsNotEmpty({ message: 'لطفا رمز عبور را وارد کنید' })
  password: string;
}
