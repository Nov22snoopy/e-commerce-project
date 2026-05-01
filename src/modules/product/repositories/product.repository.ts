import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction, WhereOptions } from 'sequelize';
import { SkusEntity } from '../../inventory/entities/skus.entity';
import { BrandsEntity } from '../../master-data/entities/brands.entity';
import { CategoriesEntity } from '../../master-data/entities/categories.entity';
import { ColorsEntity } from '../../master-data/entities/colors.entity';
import { SizesEntity } from '../../master-data/entities/sizes.entity';
import { ProductCategoriesEntity } from '../entites/productCategories.entity';
import { ProductVariantsEntity } from '../entites/productVariants.entity';
import { ProductStatus, ProductsEntity } from '../entites/products.entity';

export interface ProductFilter {
  brandId?: string;
  status?: ProductStatus;
}

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(ProductsEntity) private readonly productsModel: typeof ProductsEntity,
    @InjectModel(ProductVariantsEntity) private readonly variantsModel: typeof ProductVariantsEntity,
    @InjectModel(ProductCategoriesEntity) private readonly productCategoriesModel: typeof ProductCategoriesEntity,
    @InjectModel(SkusEntity) private readonly skusModel: typeof SkusEntity,
  ) {}

  private get fullInclude() {
    return [
      { model: BrandsEntity, as: 'brand' },
      { model: CategoriesEntity, as: 'categories', through: { attributes: [] } },
      {
        model: ProductVariantsEntity,
        as: 'productVariants',
        include: [
          { model: ColorsEntity, as: 'color' },
          { model: SkusEntity, as: 'skus', include: [{ model: SizesEntity, as: 'size' }] },
        ],
      },
    ];
  }

  async findAll(filter: ProductFilter): Promise<ProductsEntity[]> {
    const where: WhereOptions<ProductsEntity> = {};
    if (filter.brandId) where['brandId'] = filter.brandId;
    if (filter.status) where['status'] = filter.status;

    return this.productsModel.findAll({ where, include: this.fullInclude });
  }

  async findBySlug(slug: string): Promise<ProductsEntity> {
    const product = await this.productsModel.findOne({
      where: { slug },
      include: this.fullInclude,
    });
    if (!product) throw new NotFoundException(`Product with slug "${slug}" not found`);
    return product;
  }

  async findById(id: string, transaction?: Transaction): Promise<ProductsEntity> {
    const product = await this.productsModel.findByPk(id, {
      include: this.fullInclude,
      transaction,
    });
    if (!product) throw new NotFoundException(`Product with id "${id}" not found`);
    return product;
  }

  async create(
    data: Partial<ProductsEntity>,
    transaction: Transaction,
  ): Promise<ProductsEntity> {
    return this.productsModel.create(data as any, { transaction });
  }

  async createVariant(
    data: Partial<ProductVariantsEntity>,
    transaction: Transaction,
  ): Promise<ProductVariantsEntity> {
    return this.variantsModel.create(data as any, { transaction });
  }

  async createSku(
    data: Partial<SkusEntity>,
    transaction: Transaction,
  ): Promise<SkusEntity> {
    return this.skusModel.create(data as any, { transaction });
  }

  async linkCategories(
    productId: string,
    categoryIds: string[],
    transaction: Transaction,
  ): Promise<void> {
    const records = categoryIds.map((categoryId) => ({ productId, categoryId }));
    await this.productCategoriesModel.bulkCreate(records as any, { transaction });
  }

  async unlinkAllCategories(productId: string, transaction: Transaction): Promise<void> {
    await this.productCategoriesModel.destroy({ where: { productId }, transaction });
  }

  async update(
    id: string,
    data: Partial<ProductsEntity>,
    transaction: Transaction,
  ): Promise<ProductsEntity> {
    await this.productsModel.update(data as any, { where: { id }, transaction });
    return this.findById(id, transaction);
  }

  async delete(id: string, transaction: Transaction): Promise<void> {
    const product = await this.findById(id, transaction);
    await product.destroy({ transaction });
  }
}
