import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
  OneToMany,
  Column,
} from 'typeorm';
import { UserPublic } from './UserPublic';
import { Product } from './Product';
import { Orders } from './Order';
import { AbstractEntity } from './common/Abstract';

@Entity()
export class Basket extends AbstractEntity {
  @Column({ nullable: true })
  purePrice: number;

  @Column({ nullable: true })
  finalPrice: number;

  @Column({ nullable: true })
  benefit: number;

  @Column({ nullable: true })
  shippingPrice: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @OneToOne(() => UserPublic)
  @JoinColumn()
  user: UserPublic;

  @ManyToMany(() => Product, (product) => product.baskets)
  @JoinTable()
  products: Product[];

  @OneToMany(() => Orders, (orders) => orders.cart)
  orders: Orders[];

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
