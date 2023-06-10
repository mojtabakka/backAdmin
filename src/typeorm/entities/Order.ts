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
import { orderStatus } from 'src/enums/enums.enum';
import { Basket } from './‌Basket';
import { Address } from './Address';

@Entity()
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true, default: orderStatus.NotPayed })
  status: string;

  @Column({ nullable: true })
  value: string;

  @Column({ nullable: true })
  shippingTime: string;

  @ManyToOne(() => UserPublic, (userPublic) => userPublic.orders)
  user: UserPublic;

  @ManyToOne(() => Basket, (basket) => basket.orders)
  cart: Basket;

  @ManyToOne(() => Address, (address) => address.orders)
  address: Address;

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
