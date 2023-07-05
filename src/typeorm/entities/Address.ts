import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { UserPublic } from './UserPublic';
import { Orders } from './Order';
import { AbstractEntity } from './common/Abstract';

@Entity()
export class Address extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  plaque: string;

  @Column({ nullable: true })
  unit: string;

  @Column({ nullable: true, charset: 'utf8' })
  state: string;

  @Column({ nullable: true, charset: 'utf8' })
  district: string;

  @Column({ nullable: true, charset: 'utf8' })
  city: string;

  @Column({ nullable: true })
  postalCode: string;

  @ManyToOne(() => UserPublic, (user) => user.addresses)
  user: UserPublic;

  @OneToMany(() => Orders, (orders) => orders.address)
  orders: Orders[];

  @Column({ nullable: false, default: true })
  active: boolean;

  @Column({ nullable: false })
  receivername: string;

  @Column({ nullable: false, charset: 'utf8' })
  receiverlastname: string;

  @Column({ nullable: false, charset: 'utf8' })
  recivermobile: string;

  @Column({ nullable: false })
  address: string;
}
