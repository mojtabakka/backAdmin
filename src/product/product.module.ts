import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/typeorm/entities/Product';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/typeorm/entities/User';
import { Role } from 'src/typeorm/entities/Role';
import { ProductPhoto } from 'src/typeorm/entities/ProductPhoto';
import { UserPublic } from 'src/typeorm/entities/UserPublic';
import { Category } from 'src/typeorm/entities/Category';
import { Properties } from 'src/typeorm/entities/Properties';
import { ProductTypes } from 'src/typeorm/entities/ProductTypes';
import { Brands } from 'src/typeorm/entities/Brands';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      User,
      Role,
      ProductPhoto,
      UserPublic,
      Category,
      Properties,
      ProductTypes,
      Properties,
      Brands,
    ]),
  ],
  exports: [TypeOrmModule],
  providers: [ProductService, UsersService],
  controllers: [ProductController],
})
export class ProductModule {}
