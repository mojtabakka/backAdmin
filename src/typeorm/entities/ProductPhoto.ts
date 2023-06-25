import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Product } from './Product';
import { AbstractEntity } from './common/Abstract';

@Entity()
export class ProductPhoto extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  src: string;

  @ManyToMany(() => Product, (product) => product.photos)
  @JoinTable()
  products: Product[];
}
