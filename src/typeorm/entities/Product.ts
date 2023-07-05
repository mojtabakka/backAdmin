import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  PrimaryColumn,
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

  @Column({ nullable: true,charset:'utf8' })
  warranty: string;

  @PrimaryColumn({ nullable: false,charset:'utf8' })
  model: string;

  @Column({ nullable: true })
  price: string;

  @ManyToMany(() => Properties)
  @JoinTable()
  properties: Properties[];

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

  @ManyToMany(() => Brands, (brand) => brand.products)
  @JoinTable()
  brands: Brands[];

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable()
  categories: Category[];

  @ManyToMany(() => ProductTypes, (type) => type.products)
  @JoinTable()
  productTypes: ProductTypes[];

  @ManyToMany(() => ProductPhoto, (ProductPhoto) => ProductPhoto.products)
  photos: ProductPhoto[];

  @ManyToOne(() => User, (user) => user.product)
  author: User;

  @ManyToMany(() => Basket, (basket) => basket.products)
  baskets: Basket[];
}
