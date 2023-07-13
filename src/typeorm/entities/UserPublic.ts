import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserPhoto } from './UserPhoto';
import { Orders } from './Order';
import { Address } from './Address';
import { AbstractEntity } from './common/Abstract';

@Entity()
export class UserPublic extends AbstractEntity {
  @Column({ nullable: true, charset: 'utf8' })
  username: string;

  @Column({ nullable: true, charset: 'utf8' })
  name: string;

  @Column({ nullable: true, charset: 'utf8' })
  lastName: string;

  @Column({ nullable: true })
  nationalCode: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  isWorkMate: boolean;

  @OneToOne(() => UserPhoto)
  @JoinColumn()
  avatar: UserPhoto;

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];

  @OneToMany(() => Orders, (order) => order.user)
  orders: Orders[];

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
