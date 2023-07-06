import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { IsEmpty } from 'class-validator';
import { ProductPhoto } from './ProductPhoto';
import { Basket } from './‌Basket';
import { Brands } from './Brands';
import { Category } from './Category';
import { ProductTypes } from './ProductTypes';
import { Properties } from './Properties';
import { AbstractEntity } from './common/Abstract';

@Entity()
export class Product extends AbstractEntity {
  @Column({ nullable: true, charset: 'utf8' })
  @IsEmpty()
  deliveryMethod: string;

  @Column({ nullable: true, charset: 'utf8' })
  warranty: string;

  @Column({ nullable: false, charset: 'utf8' })
  model: string;

  @Column({ nullable: true })
  priceForUser: string;

  @Column({ nullable: true })
  off: number;

  @Column({ nullable: true })
  priceForWorkmate: string;

  @Column({ nullable: true })
  exist: boolean;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  shippingCost: string;

  @ManyToOne(() => Brands, (brand) => brand.products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  brand: Brands;

  @ManyToMany(() => Properties, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinTable()
  properties: Properties[];

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  category: Category;

  @ManyToMany(() => ProductTypes, (type) => type.products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinTable({
    joinColumn: {
      name: 'Product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'producType_id',
      referencedColumnName: 'id',
    },
  })
  productTypes: ProductTypes[];

  @ManyToMany(() => ProductPhoto, (ProductPhoto) => ProductPhoto.products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  photos: ProductPhoto[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  author: User;

  @ManyToMany(() => Basket, (basket) => basket.products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  baskets: Basket[];
}
