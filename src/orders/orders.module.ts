import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Role } from 'src/typeorm/entities/Role';
import { UserPublic } from 'src/typeorm/entities/UserPublic';
import { UsersService } from 'src/users/users.service';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/typeorm/entities/Product';
import { ProductPhoto } from 'src/typeorm/entities/ProductPhoto';
import { Orders } from 'src/typeorm/entities/Order';
import { Basket } from 'src/typeorm/entities/‌Basket';
import { Address } from 'src/typeorm/entities/Address';
import { AddressService } from 'src/address/address.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      UserPublic,
      Product,
      ProductPhoto,
      Orders,
      Basket,
      Address,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, UsersService, ProductService, AddressService],
})
export class OrdersModule {}
