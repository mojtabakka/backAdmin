import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserPublic } from './UserPublic';
import { Product } from './Product';
import { orderStatus } from 'src/enums/enums.enum';

@Entity()
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true, default: orderStatus.NotPayed })
  status: string;

  @Column({ nullable: true })
  value: string;

  @Column({ nullable: true })
  priceForUser: string;

  @ManyToOne(() => UserPublic, (userPublic) => userPublic.orders)
  user: UserPublic;

  @OneToMany(() => Product, (product) => product.order)
  products: Product[];

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
