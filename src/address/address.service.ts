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
    const address = await this.addressRepository
      .createQueryBuilder('address')
      .where('userId=:id', {
        id: user.sub,
      })
      .getMany();

    return address;
  }

  async deleteAddress(id: number) {
    const address = await this.addressRepository.delete({ id });
    return address;
  }

  async getActiveAddress(id: number): Promise<Address | undefined> {
    const address = await this.addressRepository
      .createQueryBuilder('address')
      .where('userId=:id  and active=1 ', {
        id,
      })
      .getOne();
    console.log(address);

    return address;
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
      active: true,
    });

    const result = await this.addressRepository.save(address);
    return result;
  }

  async changeActiveAddress(addressId: number, userInfo: any) {
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
  }
}
