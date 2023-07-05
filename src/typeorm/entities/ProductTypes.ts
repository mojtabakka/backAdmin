import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Category } from './Category';
import { Product } from './Product';
import { AbstractEntity } from './common/Abstract';

@Entity()
export class ProductTypes extends AbstractEntity {
  @Column({ unique: true, charset: 'utf8' })
  type: string;

  @Column({ nullable: true, charset: 'utf8' })
  title: string;

  @ManyToMany(() => Category, (category) => category.productTypes)
  categories: Category[];

  @ManyToMany(() => Product, (product) => product.productTypes)
  products: Product[];
}
