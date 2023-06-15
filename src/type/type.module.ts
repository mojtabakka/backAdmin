import { Module } from '@nestjs/common';
import { TypeService } from './type.service';
import { TypeController } from './type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypes } from 'src/typeorm/entities/ProductTypes';
import { Brands } from 'src/typeorm/entities/Brands';
import { Category } from 'src/typeorm/entities/Category';

@Module({
  imports: [TypeOrmModule.forFeature([ProductTypes, Brands, Category])],

  providers: [TypeService],
  controllers: [TypeController],
})
export class TypeModule {}
