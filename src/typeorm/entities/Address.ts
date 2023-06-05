import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { UserPublic } from './UserPublic';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  plaque: string;

  @Column({ nullable: true })
  unit: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  postalCode: string;

  @ManyToOne(() => UserPublic, (user) => user.addresses)
  user: UserPublic;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: false, default: true })
  active: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
