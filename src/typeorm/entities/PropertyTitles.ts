import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Properties } from './Properties';
import { Category } from './Category';
import { AbstractEntity } from './common/Abstract';

@Entity()
export class PropertyTitles extends AbstractEntity {
  @Column({ unique: true, charset: 'utf8' })
  title: string;

  @ManyToOne(() => Category, (user) => user.propertyTitles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  category: Category;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @OneToMany(() => Properties, (photo) => photo.propertyTitle)
  properties: Properties[];

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;
}
