import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { Address } from 'src/typeorm/entities/Address';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPublic } from 'src/typeorm/entities/UserPublic';
import { User } from 'src/typeorm/entities/User';
import { Role } from 'src/typeorm/entities/Role';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Address, User, Role, UserPublic])],
  controllers: [AddressController],
  providers: [AddressService, UsersService],
})
export class AddressModule {}
