import { Column, DataType, HasMany, Table, Unique } from 'sequelize-typescript';
import { BaseEntity } from '../../../core/database/base.entity';
import { ProductVariantsEntity } from '../../product/entites/productVariants.entity';

@Table({
  tableName: 'colors',
  paranoid: true,
  underscored: true,
})
export class ColorsEntity extends BaseEntity {
  @Unique
  @Column({ type: DataType.STRING, allowNull: false, field: 'name' })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'hex_code' })
  declare hexCode: string;

  @HasMany(() => ProductVariantsEntity, { foreignKey: 'colorId', sourceKey: 'id' })
  declare productVariants: ProductVariantsEntity[];
}
