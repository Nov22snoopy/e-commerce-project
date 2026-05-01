import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseEntity } from '../../../core/database/base.entity';
import { CategoryGroupsEntity } from './categoryGroups.entity';
import { ProductCategoriesEntity } from '../../product/entites/productCategories.entity';
import { ProductsEntity } from '../../product/entites/products.entity';

@Table({
  tableName: 'categories',
  paranoid: true,
  underscored: true,
  indexes: [{ name: 'idx_categories_slug', unique: true, fields: ['slug'] }],
})
export class CategoriesEntity extends BaseEntity {
  @ForeignKey(() => CategoryGroupsEntity)
  @Column({ type: DataType.UUID, allowNull: false, field: 'group_id' })
  declare groupId: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'name' })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'slug' })
  declare slug: string;

  @BelongsTo(() => CategoryGroupsEntity, {
    foreignKey: 'groupId',
    targetKey: 'id',
  })
  declare categoryGroup: CategoryGroupsEntity;

  @HasMany(() => ProductCategoriesEntity, {
    foreignKey: 'categoryId',
    sourceKey: 'id',
  })
  declare productCategories: ProductCategoriesEntity[];

  @BelongsToMany(() => ProductsEntity, () => ProductCategoriesEntity)
  declare products: ProductsEntity[];
}
