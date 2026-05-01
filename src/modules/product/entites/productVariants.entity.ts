import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseEntity } from '../../../core/database/base.entity';
import { ProductsEntity } from './products.entity';
import { ColorsEntity } from '../../master-data/entities/colors.entity';
import { SkusEntity } from '../../inventory/entities/skus.entity';


@Table({
  tableName: 'product_variants',
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'uq_product_variants_product_color',
      unique: true,
      fields: ['product_id', 'color_id'],
    },
  ],
})
export class ProductVariantsEntity extends BaseEntity {
  @ForeignKey(() => ProductsEntity)
  @Column({ type: DataType.UUID, allowNull: false, field: 'product_id' })
  declare productId: string;

  @ForeignKey(() => ColorsEntity)
  @Column({ type: DataType.UUID, allowNull: false, field: 'color_id' })
  declare colorId: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
    field: 'images',
  })
  declare images: string[];

  @BelongsTo(() => ProductsEntity, { foreignKey: 'productId', targetKey: 'id' })
  declare product: ProductsEntity;

  @BelongsTo(() => ColorsEntity, { foreignKey: 'colorId', targetKey: 'id' })
  declare color: ColorsEntity;

  @HasMany(() => SkusEntity, { foreignKey: 'variantId', sourceKey: 'id' })
  declare skus: SkusEntity[];
}
