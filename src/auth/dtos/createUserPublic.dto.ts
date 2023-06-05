export interface CreateUserPublicDto {
  id: number;
  username: string;
  name: string;
  lastName: string;
  nationalCode: string;
  email: string;
  phoneNumber: string;
  password: string;
  isWorkMate: boolean;
}
