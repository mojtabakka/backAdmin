import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ProductTypes } from './ProductTypes';
import { Category } from './Category';
import { Product } from './Product';
import { AbstractEntity } from './common/Abstract';

@Entity()
export class Brands extends AbstractEntity {
  @Column({ nullable: true, charset: 'utf8' })
  brand: string;

  @Column({ nullable: true, charset: 'utf8' })
  title: string;

  @ManyToMany(() => Category, (category) => category.brands)
  categories: Category[];

  @ManyToMany(() => Product, (product) => product.brands)
  products: Product[];
}
