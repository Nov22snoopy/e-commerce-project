import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { CategoriesEntity } from '../../master-data/entities/categories.entity';
import { ProductsEntity } from './products.entity';

@Table({
  tableName: 'product_categories',
  timestamps: false,
  underscored: true,
})
export class ProductCategoriesEntity extends Model<ProductCategoriesEntity> {
  @PrimaryKey
  @ForeignKey(() => ProductsEntity)
  @Column({ type: DataType.UUID, allowNull: false, field: 'product_id' })
  declare productId: string;

  @PrimaryKey
  @ForeignKey(() => CategoriesEntity)
  @Column({ type: DataType.UUID, allowNull: false, field: 'category_id' })
  declare categoryId: string;

  @BelongsTo(() => ProductsEntity, { foreignKey: 'productId', targetKey: 'id' })
  declare product: ProductsEntity;

  @BelongsTo(() => CategoriesEntity, { foreignKey: 'categoryId', targetKey: 'id' })
  declare category: CategoriesEntity;
}
