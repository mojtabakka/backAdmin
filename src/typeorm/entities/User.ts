import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './Role';
import { Product } from './Product';
import { UserPhoto } from './UserPhoto';
import { AbstractEntity } from './common/Abstract';

@Entity()
export class User extends AbstractEntity {
  @Column({ nullable: true,charset:'utf8' })
  username: string;

  @Column({ nullable: true,charset:'utf8' })
  name: string;

  @Column({ nullable: true,charset:'utf8' })
  lastName: string;

  @Column({ nullable: true })
  nationalCode: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true,charset:'utf8' })
  phoneNumber: string;

  @Column({ nullable: true })
  password: string;

  @OneToMany(() => UserPhoto, (userPhoto) => userPhoto.user)
  photos: UserPhoto[];

  @OneToMany(() => Role, (role) => role.user)
  roles: Role[];

  @OneToMany(() => Product, (role) => role.author)
  product: Product[];

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
