import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ProductsEntity } from './entites/products.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { ProductRepository } from './repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    private readonly productRepository: ProductRepository,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductsEntity> {
    const transaction: Transaction = await this.sequelize.transaction();

    try {
      const product = await this.productRepository.create(
        {
          brandId: dto.brandId,
          name: dto.name,
          slug: dto.slug,
          description: dto.description,
          status: dto.status,
        },
        transaction,
      );

      if (dto.categoryIds?.length) {
        await this.productRepository.linkCategories(product.id, dto.categoryIds, transaction);
      }

      for (const variantDto of dto.variants) {
        const variant = await this.productRepository.createVariant(
          {
            productId: product.id,
            colorId: variantDto.colorId,
            images: variantDto.images,
          },
          transaction,
        );

        for (const skuDto of variantDto.skus) {
          await this.productRepository.createSku(
            {
              variantId: variant.id,
              sizeId: skuDto.sizeId,
              skuCode: skuDto.skuCode,
              price: String(skuDto.price),
              salePrice: skuDto.salePrice != null ? String(skuDto.salePrice) : null,
              stock: skuDto.stock ?? 0,
            },
            transaction,
          );
        }
      }

      const result = await this.productRepository.findById(product.id, transaction);
      await transaction.commit();
      return result;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async findAll(filter: FilterProductDto): Promise<ProductsEntity[]> {
    return this.productRepository.findAll(filter);
  }

  async findOne(slug: string): Promise<ProductsEntity> {
    return this.productRepository.findBySlug(slug);
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductsEntity> {
    const transaction: Transaction = await this.sequelize.transaction();

    try {
      const updateData: Partial<ProductsEntity> = {};
      if (dto.brandId !== undefined) updateData.brandId = dto.brandId;
      if (dto.name !== undefined) updateData.name = dto.name;
      if (dto.slug !== undefined) updateData.slug = dto.slug;
      if (dto.description !== undefined) updateData.description = dto.description ?? null;
      if (dto.status !== undefined) updateData.status = dto.status;

      const product = await this.productRepository.update(id, updateData, transaction);

      if (dto.categoryIds !== undefined) {
        await this.productRepository.unlinkAllCategories(id, transaction);
        if (dto.categoryIds.length) {
          await this.productRepository.linkCategories(id, dto.categoryIds, transaction);
        }
      }

      await transaction.commit();
      return product;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async remove(id: string): Promise<void> {
    const transaction: Transaction = await this.sequelize.transaction();

    try {
      await this.productRepository.delete(id, transaction);
      await transaction.commit();
      return;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}
