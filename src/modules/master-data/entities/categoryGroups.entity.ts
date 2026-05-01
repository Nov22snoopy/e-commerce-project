import { Column, DataType, HasMany, Table, Unique } from 'sequelize-typescript';
import { BaseEntity } from '../../../core/database/base.entity';
import { CategoriesEntity } from './categories.entity';

@Table({
  tableName: 'category_groups',
  paranoid: true,
  underscored: true,
})
export class CategoryGroupsEntity extends BaseEntity {
  @Unique
  @Column({ type: DataType.STRING, allowNull: false, field: 'name' })
  declare name: string;

  @Column({ type: DataType.TEXT, allowNull: true, field: 'description' })
  declare description: string | null;

  @HasMany(() => CategoriesEntity, { foreignKey: 'groupId', sourceKey: 'id' })
  declare categories: CategoriesEntity[];
}
