import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Product } from './Product';
import { AbstractEntity } from './common/Abstract';

@Entity()
export class ProductPhoto extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, charset: 'utf8' })
  src: string;

  @ManyToMany(() => Product, (product) => product.photos, { cascade: true })
  @JoinTable()
  products: Product[];
}
