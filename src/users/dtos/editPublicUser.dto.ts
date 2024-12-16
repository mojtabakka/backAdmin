import { IsNotEmpty } from 'class-validator';

export class editPublicUser {
  username: string;
  // @IsNotEmpty({ message: ' نام را وارد کنید' })
  name: string;
  lastName: string;
  nationalCode: string;
  email: string;
  phoneNumber: string;
  password: string;
  isWorkMate: boolean;
}
