import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { ProductService } from '../../src/modules/product/product.service';
import { ProductRepository } from '../../src/modules/product/repositories/product.repository';
import { CreateProductDto } from '../../src/modules/product/dto/create-product.dto';
import { ProductsEntity } from '../../src/modules/product/entites/products.entity';
import { ProductVariantsEntity } from '../../src/modules/product/entites/productVariants.entity';

function buildProduct(id: string): ProductsEntity {
  return Object.assign(Object.create(ProductsEntity.prototype) as ProductsEntity, { id });
}

function buildVariant(id: string): ProductVariantsEntity {
  return Object.assign(Object.create(ProductVariantsEntity.prototype) as ProductVariantsEntity, { id });
}

describe('ProductService', () => {
  let service: ProductService;
  let mockedSequelize: Sequelize;
  let mockedRepo: ProductRepository;

  beforeEach(() => {
    mockedSequelize = mock(Sequelize);
    mockedRepo = mock(ProductRepository);

    service = new ProductService(instance(mockedSequelize), instance(mockedRepo));
  });

  describe('create', () => {
    it('should create product tree and commit transaction (happy path)', async () => {
      // Arrange
      const tx = {
        commit: jest.fn<Promise<void>, []>().mockResolvedValue(undefined),
        rollback: jest.fn<Promise<void>, []>().mockResolvedValue(undefined),
      } as unknown as Transaction;

      const dto: CreateProductDto = {
        brandId: '11111111-1111-1111-1111-111111111111',
        name: 'Air Max',
        slug: 'air-max',
        description: 'desc',
        categoryIds: ['22222222-2222-2222-2222-222222222222'],
        variants: [
          {
            colorId: '33333333-3333-3333-3333-333333333333',
            images: ['img1'],
            skus: [
              {
                sizeId: '44444444-4444-4444-4444-444444444444',
                skuCode: 'SKU-1',
                price: 100,
                salePrice: 90,
                stock: 5,
              },
            ],
          },
        ],
      };

      const product = buildProduct('prod-uuid');
      const variant = buildVariant('variant-uuid');
      const finalProduct = buildProduct('prod-uuid');

      when(mockedSequelize.transaction()).thenResolve(tx);
      when(mockedRepo.create(anything(), anything())).thenResolve(product);
      when(mockedRepo.linkCategories(product.id, dto.categoryIds!, anything())).thenResolve();
      when(mockedRepo.createVariant(anything(), anything())).thenResolve(variant);
      when(mockedRepo.createSku(anything(), anything())).thenResolve({} as never);
      when(mockedRepo.findById(product.id, anything())).thenResolve(finalProduct);

      // Act
      const result = await service.create(dto);

      // Assert
      expect(result).toBe(finalProduct);
      expect(tx.commit).toHaveBeenCalledTimes(1);
      expect(tx.rollback).toHaveBeenCalledTimes(0);

      verify(mockedSequelize.transaction()).once();
      verify(mockedRepo.create(anything(), anything())).once();
      verify(mockedRepo.createVariant(anything(), anything())).once();
      verify(mockedRepo.createSku(anything(), anything())).once();
      verify(mockedRepo.findById(product.id, anything())).once();
    });

    it('should rollback transaction and rethrow when repository throws (error path)', async () => {
      // Arrange
      const tx = {
        commit: jest.fn<Promise<void>, []>().mockResolvedValue(undefined),
        rollback: jest.fn<Promise<void>, []>().mockResolvedValue(undefined),
      } as unknown as Transaction;

      const dto: CreateProductDto = {
        brandId: '11111111-1111-1111-1111-111111111111',
        name: 'Air Max',
        slug: 'air-max',
        variants: [
          {
            colorId: '33333333-3333-3333-3333-333333333333',
            images: [],
            skus: [
              {
                sizeId: '44444444-4444-4444-4444-444444444444',
                skuCode: 'SKU-1',
                price: 100,
              },
            ],
          },
        ],
      };

      const product = buildProduct('prod-uuid');
      const boom = new Error('createVariant failed');

      when(mockedSequelize.transaction()).thenResolve(tx);
      when(mockedRepo.create(anything(), anything())).thenResolve(product);
      when(mockedRepo.createVariant(anything(), anything())).thenReject(boom);

      // Act
      const act = service.create(dto);

      // Assert
      await expect(act).rejects.toThrow('createVariant failed');
      expect(tx.rollback).toHaveBeenCalledTimes(1);
      expect(tx.commit).toHaveBeenCalledTimes(0);
    });
  });
});

