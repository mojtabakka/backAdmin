import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { CreateUser, CreateUserPublic } from './utils/types/userTypes';
import { Role } from 'src/typeorm/entities/Role';
import { UserPublic } from 'src/typeorm/entities/UserPublic';
import { editPublicUser } from './dtos/editPublicUser.dto';
import { orderStatus } from 'src/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(UserPublic)
    private userPublicRepository: Repository<UserPublic>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { username: username },
      relations: ['roles'],
    });
  }

  async findOnePublic(phoneNumber: string): Promise<UserPublic | undefined> {
    return this.userPublicRepository.findOneBy({});
  }

  async createUser(createUserDetail: CreateUser) {
    const newUser = this.usersRepository.create({
      username: createUserDetail.username,
      password: createUserDetail.password,
    });

    const user = await this.usersRepository.save(newUser);
    return user;
  }

  async editUser(createUserDetail: CreateUser, user) {
    const updatedUser = await this.usersRepository.update(user.sub, {
      ...createUserDetail,
    });
    return updatedUser;
  }
  async setUserRole(id: number, role: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    const roleFinded = await this.roleRepository.findOneBy({ role });
    if (!roleFinded) {
      throw new HttpException('role not found', HttpStatus.NOT_FOUND);
    }
    user.roles = [roleFinded];
    const userUpdated = await this.usersRepository.save(user);

    return userUpdated;
  }

  async getPublicUser(phoneNumber: string): Promise<UserPublic | undefined> {
    return this.userPublicRepository.findOneBy({ phoneNumber });
  }

  async createUserPublic(
    createUserPublicDetail: CreateUserPublic,
  ): Promise<UserPublic | undefined> {
    const newUser = this.usersRepository.create({
      phoneNumber: createUserPublicDetail.phoneNumber,
    });
    const user = await this.userPublicRepository.save(newUser);
    return user;
  }

  async editPublicUser(createUserPublicDetail: editPublicUser, hUser: any) {
    const user = await this.getPublicUser(hUser.sub);
    const updatedUser = await this.userPublicRepository.update(user.id, {
      ...createUserPublicDetail,
    });
    return updatedUser;
  }

  async getUserOrderNotpayed(id: number) {
    const userOrder = await this.userPublicRepository
      .createQueryBuilder('user_public')
      .innerJoinAndSelect('user_public.orders', 'orders')
      .where('user_public.id=:id && orders.status=:status', {
        id,
        status: orderStatus.NotPayed,
      })
      .getOne();

    return userOrder;
  }
}
