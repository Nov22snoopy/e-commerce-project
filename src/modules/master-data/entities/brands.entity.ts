import { Column, DataType, HasMany, Table, Unique } from 'sequelize-typescript';
import { BaseEntity } from '../../../core/database/base.entity';
import { ProductsEntity } from '../../product/entites/products.entity';

@Table({
  tableName: 'brands',
  paranoid: true,
  underscored: true,
  indexes: [{ name: 'idx_brands_slug', unique: true, fields: ['slug'] }],
})
export class BrandsEntity extends BaseEntity {
  @Unique
  @Column({ type: DataType.STRING, allowNull: false, field: 'name' })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'slug' })
  declare slug: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'logo_url' })
  declare logoUrl: string | null;

  @Column({ type: DataType.TEXT, allowNull: true, field: 'description' })
  declare description: string | null;

  @HasMany(() => ProductsEntity, { foreignKey: 'brandId', sourceKey: 'id' })
  declare products: ProductsEntity[];
}
