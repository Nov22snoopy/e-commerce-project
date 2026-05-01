import { Column, DataType, HasMany, Table, Unique } from 'sequelize-typescript';
import { BaseEntity } from '../../../core/database/base.entity';
import { SkusEntity } from '../../inventory/entities/skus.entity';

@Table({
  tableName: 'sizes',
  paranoid: true,
  underscored: true,
})
export class SizesEntity extends BaseEntity {
  @Unique
  @Column({ type: DataType.STRING, allowNull: false, field: 'name' })
  declare name: string;

  @HasMany(() => SkusEntity, { foreignKey: 'sizeId', sourceKey: 'id' })
  declare skus: SkusEntity[];
}
