import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Product } from './Product';
import { ProductTypes } from './ProductTypes';
import { Brands } from './Brands';
import { PropertyTitles } from './PropertyTitles';
import { AbstractEntity } from './common/Abstract';

@Entity()
export class Category extends AbstractEntity {
  @Column({ nullable: true, charset: 'utf8' })
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
}
