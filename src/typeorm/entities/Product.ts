import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { User } from './User';
import { IsEmpty } from 'class-validator';
import { ProductPhoto } from './ProductPhoto';
import { Orders } from './Order';
import { Basket } from './‌Basket';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsEmpty()
  deliveryMethod: string;

  @Column({ nullable: true })
  warranty: string;

  @Column({ nullable: false })
  model: string;

  @Column({ nullable: true })
  price: string;

  @Column({ nullable: true })
  features: string;

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

  @ManyToMany(() => ProductPhoto, (ProductPhoto) => ProductPhoto.products)
  photos: ProductPhoto[];

  @ManyToOne(() => User, (user) => user.product)
  author: User;

  @ManyToMany(() => Basket, (basket) => basket.products)
  baskets: Basket[];

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
