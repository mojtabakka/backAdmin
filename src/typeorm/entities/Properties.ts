import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { PropertyTitles } from './PropertyTitles';
import { Product } from './Product';
import { AbstractEntity } from './common/Abstract';

@Entity()
export class Properties extends AbstractEntity {
  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  property: string;

  @ManyToOne(() => PropertyTitles, (pt) => pt.properties)
  propertyTitle: PropertyTitles;

  @ManyToMany(() => Product)
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
