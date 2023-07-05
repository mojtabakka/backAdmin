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
} from 'typeorm';
import { UserPublic } from './UserPublic';
import { Product } from './Product';
import { orderStatus } from 'src/constants';
import { Basket } from './‌Basket';
import { Address } from './Address';
import { AbstractEntity } from './common/Abstract';

@Entity()
export class Orders extends AbstractEntity {
  @Column({ nullable: true, default: orderStatus.NotPayed })
  status: string;

  @Column({ nullable: true, charset: 'utf8' })
  value: string;

  @Column({ nullable: true })
  shippingTime: string;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  finalPrice: number;

  @Column({ nullable: true })
  shippingPrice: number;

  @ManyToOne(() => UserPublic, (userPublic) => userPublic.orders)
  user: UserPublic;

  @ManyToOne(() => Basket, (basket) => basket.orders)
  cart: Basket;

  @ManyToOne(() => Address, (address) => address.orders)
  address: Address;
}
