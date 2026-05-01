import { instance, mock, verify, when } from 'ts-mockito';
import { MasterDataService } from '../../src/modules/master-data/master-data.service';
import { BrandsEntity } from '../../src/modules/master-data/entities/brands.entity';
import { CategoriesEntity } from '../../src/modules/master-data/entities/categories.entity';
import { BrandsRepository } from '../../src/modules/master-data/repositories/brands.repo';
import { CategoriesRepository } from '../../src/modules/master-data/repositories/category.repo';
import { CategoryGroupsRepository } from '../../src/modules/master-data/repositories/categoryGroup.repo';
import { ColorsRepository } from '../../src/modules/master-data/repositories/colors.repo';
import { MasterDataReadRepository } from '../../src/modules/master-data/repositories/master-data-read.repo';
import { SizesRepository } from '../../src/modules/master-data/repositories/sizes.repo';

function buildBrand(id: string): BrandsEntity {
  return Object.assign(Object.create(BrandsEntity.prototype) as BrandsEntity, { id });
}

function buildCategory(id: string): CategoriesEntity {
  return Object.assign(Object.create(CategoriesEntity.prototype) as CategoriesEntity, { id });
}

describe('MasterDataService', () => {
  let service: MasterDataService;

  let mockedReadRepo: MasterDataReadRepository;
  let mockedBrandsRepo: BrandsRepository;
  let mockedCategoriesRepo: CategoriesRepository;
  let mockedCategoryGroupsRepo: CategoryGroupsRepository;
  let mockedColorsRepo: ColorsRepository;
  let mockedSizesRepo: SizesRepository;

  beforeEach(() => {
    mockedReadRepo = mock(MasterDataReadRepository);
    mockedBrandsRepo = mock(BrandsRepository);
    mockedCategoriesRepo = mock(CategoriesRepository);
    mockedCategoryGroupsRepo = mock(CategoryGroupsRepository);
    mockedColorsRepo = mock(ColorsRepository);
    mockedSizesRepo = mock(SizesRepository);

    service = new MasterDataService(
      instance(mockedReadRepo),
      instance(mockedBrandsRepo),
      instance(mockedCategoriesRepo),
      instance(mockedCategoryGroupsRepo),
      instance(mockedColorsRepo),
      instance(mockedSizesRepo),
    );
  });

  describe('findAllBrands', () => {
    it('should return brands from MasterDataReadRepository', async () => {
      // Arrange
      const brands = [buildBrand('brand-1'), buildBrand('brand-2')];
      when(mockedReadRepo.findAllBrands()).thenResolve(brands);

      // Act
      const result = await service.findAllBrands();

      // Assert
      expect(result).toBe(brands);
      verify(mockedReadRepo.findAllBrands()).once();
    });
  });

  describe('findAllCategories', () => {
    it('should return categories from MasterDataReadRepository', async () => {
      // Arrange
      const categories = [buildCategory('cat-1')];
      when(mockedReadRepo.findAllCategories()).thenResolve(categories);

      // Act
      const result = await service.findAllCategories();

      // Assert
      expect(result).toBe(categories);
      verify(mockedReadRepo.findAllCategories()).once();
    });
  });
});

