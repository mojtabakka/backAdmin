import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SendOtpDto {
  @MaxLength(11, { message: 'شماره موبایل باید ۱۱ رقم باشد' })
  @MinLength(11, { message: 'شماره موبایل باید ۱۱ رقم باشد' })
  @IsNotEmpty({ message: 'لطفا شماره موبایل خود را وارد کنید' })
  phoneNumber: string;
}
