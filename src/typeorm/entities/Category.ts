import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserPublic } from './UserPublic';
import { Product } from './Product';
import { orderStatus } from 'src/enums/enums.enum';
import { Basket } from './‌Basket';
import { Address } from './Address';
import { ProductTypes } from './ProductTypes';
import { Brands } from './Brands';
import { PropertyTitles } from './PropertyTitles';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @ManyToMany(() => ProductTypes, (type) => type.categories)
  @JoinTable()
  productTypes: ProductTypes[];

  @ManyToMany(() => Brands, (brand) => brand.categories)
  @JoinTable()
  brands: Brands[];

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];

  @OneToMany(() => PropertyTitles, (title) => title.category)
  propertyTitles: PropertyTitles[];

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
