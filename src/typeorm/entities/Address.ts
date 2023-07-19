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

  @Column({ nullable: true, charset: 'utf8' })
  plaque: string;

  @Column({ nullable: true, charset: 'utf8' })
  unit: string;

  @Column({ nullable: true, charset: 'utf8' })
  state: string;

  @Column({ nullable: true, charset: 'utf8' })
  district: string;

  @Column({ nullable: true, charset: 'utf8' })
  city: string;

  @Column({ nullable: true, charset: 'utf8' })
  postalCode: string;

  @ManyToOne(() => UserPublic, (user) => user.addresses, {
    onDelete: 'CASCADE',
  })
  user: UserPublic;

  @OneToMany(() => Orders, (orders) => orders.address, { cascade: true })
  orders: Orders[];

  @Column({ nullable: true })
  active: boolean;

  @Column({ nullable: true, charset: 'utf8' })
  receivername: string;

  @Column({ nullable: true, charset: 'utf8' })
  receiverlastname: string;

  @Column({ nullable: true, charset: 'utf8' })
  recivermobile: string;

  @Column({ nullable: true, charset: 'utf8' })
  address: string;
}
