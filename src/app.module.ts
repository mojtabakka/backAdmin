import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { Role } from './typeorm/entities/Role';
import { CaslModule } from './casl/casl.module';
import { Product } from './typeorm/entities/Product';
import { ProductPhoto } from './typeorm/entities/ProductPhoto';
import { ProductService } from './product/product.service';
import { ProductController } from './product/product.controller';
import { ProductModule } from './product/product.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserPhoto } from './typeorm/entities/UserPhoto';
import { Otp } from './typeorm/entities/Otp';
import { UserPublic } from './typeorm/entities/UserPublic';
import { Orders } from './typeorm/entities/Order';
import { OrdersModule } from './orders/orders.module';
// import { WinstonModule } from 'nest-winston';
import { Basket } from './typeorm/entities/‌Basket';
import { Address } from './typeorm/entities/Address';
import { AddressModule } from './address/address.module';
import { ProductTypes } from './typeorm/entities/ProductTypes';
import { TypeModule } from './type/type.module';
import { Brands } from './typeorm/entities/Brands';
import { Category } from './typeorm/entities/Category';
import { PropertyTitles } from './typeorm/entities/PropertyTitles';
import { Properties } from './typeorm/entities/Properties';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    PassportModule,
    MulterModule.register({
      dest: './uplaods',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '0019058101Aa@',
      database: 'test',
      entities: [
        User,
        Role,
        Product,
        ProductPhoto,
        UserPhoto,
        Otp,
        UserPublic,
        Orders,
        Basket,
        Address,
        ProductTypes,
        Brands,
        Category,
        PropertyTitles,
        Properties,
      ],
      synchronize: true,
    }),
    ProductModule,
    AuthModule,
    UsersModule,
    CaslModule,
    OrdersModule,
    AddressModule,
    TypeModule,
  ],
  controllers: [AppController, ProductController],
  providers: [AppService, ProductService],
})
export class AppModule {}
