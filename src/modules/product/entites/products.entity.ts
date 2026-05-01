import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseEntity } from '../../../core/database/base.entity';
import { BrandsEntity } from '../../master-data/entities/brands.entity';
import { CategoriesEntity } from '../../master-data/entities/categories.entity';
import { ProductCategoriesEntity } from './productCategories.entity';
import { ProductVariantsEntity } from './productVariants.entity';

export enum ProductStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

@Table({
  tableName: 'products',
  paranoid: true,
  underscored: true,
  indexes: [
    { name: 'idx_products_brand_id', fields: ['brand_id'] },
    { name: 'idx_products_slug', unique: true, fields: ['slug'] },
  ],
})
export class ProductsEntity extends BaseEntity {
  @ForeignKey(() => BrandsEntity)
  @Column({ type: DataType.UUID, allowNull: false, field: 'brand_id' })
  declare brandId: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'name' })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'slug' })
  declare slug: string;

  @Column({ type: DataType.TEXT, allowNull: true, field: 'description' })
  declare description: string | null;

  @Default(ProductStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(ProductStatus)),
    allowNull: false,
    field: 'status',
  })
  declare status: ProductStatus;

  @BelongsTo(() => BrandsEntity, { foreignKey: 'brandId', targetKey: 'id' })
  declare brand: BrandsEntity;

  @HasMany(() => ProductVariantsEntity, { foreignKey: 'productId', sourceKey: 'id' })
  declare productVariants: ProductVariantsEntity[];

  @HasMany(() => ProductCategoriesEntity, { foreignKey: 'productId', sourceKey: 'id' })
  declare productCategories: ProductCategoriesEntity[];

  @BelongsToMany(() => CategoriesEntity, () => ProductCategoriesEntity)
  declare categories: CategoriesEntity[];
}
