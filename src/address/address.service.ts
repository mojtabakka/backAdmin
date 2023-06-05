import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/typeorm/entities/Address';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateAddress } from './utils/types';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    private userService: UsersService,
  ) {}

  async getAddresses(user: any): Promise<Address[] | undefined> {
    try {
      const address = await this.addressRepository
        .createQueryBuilder('address')
        .where('userId=:id', {
          id: user.sub,
        })
        .getMany();

      return address;
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  async getActiveAddress(user: any): Promise<Address | undefined> {
    try {
      const address = await this.addressRepository
        .createQueryBuilder('address')
        .where('userId=:id and active=1', {
          id: user.sub,
        })
        .getOne();

      return address;
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
  async createAddress(
    crateAddresDetial: CreateAddress,
    userInfo: any,
  ): Promise<Address | undefined> {
    await this.addressRepository
      .createQueryBuilder('address')
      .update(Address)
      .set({ active: false })
      .where('userId=:id', {
        id: userInfo.sub,
      })
      .execute();

    const user = await this.userService.getPublicUser(userInfo.phoneNumber);
    const address = this.addressRepository.create({
      ...crateAddresDetial,
      user: user,
    });

    const result = await this.addressRepository.save(address);
    return result;
  }

  async changeActiveAddress(addressId: number, userInfo: any) {
    console.log(addressId);
    console.log(userInfo.sub);

    try {
      await this.addressRepository
        .createQueryBuilder('address')
        .update(Address)
        .set({ active: false })
        .where('userId=:userId', {
          userId: userInfo.sub,
        })
        .execute();

      const result = await this.addressRepository
        .createQueryBuilder('address')
        .update(Address)
        .set({ active: true })
        .where('id=:addressId', {
          addressId,
        })
        .execute();
    } catch (error) {
      console.log(error);
      throw new HttpException(error.response, error.status);
    }

    //   console.log(result);

    // return result;
  }
}
