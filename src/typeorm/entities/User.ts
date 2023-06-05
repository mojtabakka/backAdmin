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
import { Address } from './Address';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  nationalCode: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
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
