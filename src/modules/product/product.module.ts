import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SkusEntity } from '../inventory/entities/skus.entity';
import { ProductCategoriesEntity } from './entites/productCategories.entity';
import { ProductVariantsEntity } from './entites/productVariants.entity';
import { ProductsEntity } from './entites/products.entity';
import { ProductController } from './product.controller';
import { ProductRepository } from './repositories/product.repository';
import { ProductService } from './product.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProductsEntity,
      ProductVariantsEntity,
      ProductCategoriesEntity,
      SkusEntity,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductService],
})
export class ProductModule {}
