import { Injectable } from '@nestjs/common';
import { CategoriesEntity } from '../entities/categories.entity';
import { CategoryGroupsEntity } from '../entities/categoryGroups.entity';
import { ColorsEntity } from '../entities/colors.entity';
import { SizesEntity } from '../entities/sizes.entity';
import { BrandsEntity } from '../entities/brands.entity';
import { CategoriesRepository } from './category.repo';
import { CategoryGroupsRepository } from './categoryGroup.repo';
import { ColorsRepository } from './colors.repo';
import { SizesRepository } from './sizes.repo';
import { BrandsRepository } from './brands.repo';

@Injectable()
export class MasterDataReadRepository {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly categoryGroupsRepository: CategoryGroupsRepository,
    private readonly colorsRepository: ColorsRepository,
    private readonly sizesRepository: SizesRepository,
    private readonly brandsRepository: BrandsRepository,
  ) {}

  async findAllCategories(): Promise<CategoriesEntity[]> {
    return this.categoriesRepository.findAll();
  }

  async findAllCategoryGroups(): Promise<CategoryGroupsEntity[]> {
    return this.categoryGroupsRepository.findAll();
  }

  async findAllColors(): Promise<ColorsEntity[]> {
    return this.colorsRepository.findAll();
  }

  async findAllSizes(): Promise<SizesEntity[]> {
    return this.sizesRepository.findAll();
  }

  async findAllBrands(): Promise<BrandsEntity[]> {
    return this.brandsRepository.findAll();
  }
}
