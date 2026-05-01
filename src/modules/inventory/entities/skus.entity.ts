import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseEntity } from '../../../core/database/base.entity';
import { SizesEntity } from '../../master-data/entities/sizes.entity';
import { ProductVariantsEntity } from '../../product/entites/productVariants.entity';

@Table({
  tableName: 'skus',
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'uq_skus_variant_size',
      unique: true,
      fields: ['variant_id', 'size_id'],
    },
    { name: 'idx_skus_sku_code', unique: true, fields: ['sku_code'] },
  ],
})
export class SkusEntity extends BaseEntity {
  @ForeignKey(() => ProductVariantsEntity)
  @Column({ type: DataType.UUID, allowNull: false, field: 'variant_id' })
  declare variantId: string;

  @ForeignKey(() => SizesEntity)
  @Column({ type: DataType.UUID, allowNull: false, field: 'size_id' })
  declare sizeId: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'sku_code' })
  declare skuCode: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false, field: 'price' })
  declare price: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true, field: 'sale_price' })
  declare salePrice: string | null;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'stock' })
  declare stock: number;

  @BelongsTo(() => ProductVariantsEntity, { foreignKey: 'variantId', targetKey: 'id' })
  declare productVariant: ProductVariantsEntity;

  @BelongsTo(() => SizesEntity, { foreignKey: 'sizeId', targetKey: 'id' })
  declare size: SizesEntity;
}
