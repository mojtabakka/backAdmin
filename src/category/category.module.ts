import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from 'src/typeorm/entities/Category';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brands } from 'src/typeorm/entities/Brands';
import { ProductTypes } from 'src/typeorm/entities/ProductTypes';
import { PropertyTitles } from 'src/typeorm/entities/PropertyTitles';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Brands, ProductTypes,PropertyTitles])],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
