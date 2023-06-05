export type CreateUser = {
  id: number;
  username: string;
  name: string;
  lastName: string;
  nationalCode: string;
  email: string;
  phoneNumber: string;
  password: string;
};

export type CreateUserPublic = {
  id: number;
  username: string;
  name: string;
  lastName: string;
  nationalCode: string;
  email: string;
  phoneNumber: string;
  password: string;
  isWorkMate: boolean;
};
