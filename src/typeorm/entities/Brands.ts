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

@Entity()
export class Brands {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  title: string;

  @ManyToMany(() => Category, (category) => category.brands)
  categories: Category[];

    @ManyToMany(() => Product, (product) => product.brands)
    products: Product[];


  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;
}
