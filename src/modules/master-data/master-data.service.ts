import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryGroupDto } from './dto/create-category-group.dto';
import { UpdateCategoryGroupDto } from './dto/update-category-group.dto';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { BrandsEntity } from './entities/brands.entity';
import { CategoriesEntity } from './entities/categories.entity';
import { CategoryGroupsEntity } from './entities/categoryGroups.entity';
import { ColorsEntity } from './entities/colors.entity';
import { SizesEntity } from './entities/sizes.entity';
import { BrandsRepository } from './repositories/brands.repo';
import { CategoriesRepository } from './repositories/category.repo';
import { CategoryGroupsRepository } from './repositories/categoryGroup.repo';
import { ColorsRepository } from './repositories/colors.repo';
import { MasterDataReadRepository } from './repositories/master-data-read.repo';
import { SizesRepository } from './repositories/sizes.repo';

@Injectable()
export class MasterDataService {
  constructor(
    private readonly masterDataReadRepository: MasterDataReadRepository,
    private readonly brandsRepository: BrandsRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly categoryGroupsRepository: CategoryGroupsRepository,
    private readonly colorsRepository: ColorsRepository,
    private readonly sizesRepository: SizesRepository,
  ) {}

  // ── Brands ────────────────────────────────────────────────────────────────

  findAllBrands(): Promise<BrandsEntity[]> {
    return this.masterDataReadRepository.findAllBrands();
  }

  findBrandById(id: string): Promise<BrandsEntity> {
    return this.brandsRepository.findById(id);
  }

  createBrand(dto: CreateBrandDto): Promise<BrandsEntity> {
    return this.brandsRepository.create(dto as unknown as BrandsEntity);
  }

  updateBrand(id: string, dto: UpdateBrandDto): Promise<BrandsEntity> {
    return this.brandsRepository.update(id, dto as unknown as BrandsEntity);
  }

  deleteBrand(id: string): Promise<void> {
    return this.brandsRepository.delete(id);
  }

  // ── Category Groups ───────────────────────────────────────────────────────

  findAllCategoryGroups(): Promise<CategoryGroupsEntity[]> {
    return this.masterDataReadRepository.findAllCategoryGroups();
  }

  findCategoryGroupById(id: string): Promise<CategoryGroupsEntity> {
    return this.categoryGroupsRepository.findById(id);
  }

  createCategoryGroup(dto: CreateCategoryGroupDto): Promise<CategoryGroupsEntity> {
    return this.categoryGroupsRepository.create(dto as unknown as CategoryGroupsEntity);
  }

  updateCategoryGroup(id: string, dto: UpdateCategoryGroupDto): Promise<CategoryGroupsEntity> {
    return this.categoryGroupsRepository.update(id, dto as unknown as CategoryGroupsEntity);
  }

  deleteCategoryGroup(id: string): Promise<void> {
    return this.categoryGroupsRepository.delete(id);
  }

  // ── Categories ────────────────────────────────────────────────────────────

  findAllCategories(): Promise<CategoriesEntity[]> {
    return this.masterDataReadRepository.findAllCategories();
  }

  findCategoryById(id: string): Promise<CategoriesEntity> {
    return this.categoriesRepository.findById(id);
  }

  createCategory(dto: CreateCategoryDto): Promise<CategoriesEntity> {
    return this.categoriesRepository.create(dto as unknown as CategoriesEntity);
  }

  updateCategory(id: string, dto: UpdateCategoryDto): Promise<CategoriesEntity> {
    return this.categoriesRepository.update(id, dto as unknown as CategoriesEntity);
  }

  deleteCategory(id: string): Promise<void> {
    return this.categoriesRepository.delete(id);
  }

  // ── Colors ────────────────────────────────────────────────────────────────

  findAllColors(): Promise<ColorsEntity[]> {
    return this.masterDataReadRepository.findAllColors();
  }

  findColorById(id: string): Promise<ColorsEntity> {
    return this.colorsRepository.findById(id);
  }

  createColor(dto: CreateColorDto): Promise<ColorsEntity> {
    return this.colorsRepository.create(dto as unknown as ColorsEntity);
  }

  updateColor(id: string, dto: UpdateColorDto): Promise<ColorsEntity> {
    return this.colorsRepository.update(id, dto as unknown as ColorsEntity);
  }

  deleteColor(id: string): Promise<void> {
    return this.colorsRepository.delete(id);
  }

  // ── Sizes ─────────────────────────────────────────────────────────────────

  findAllSizes(): Promise<SizesEntity[]> {
    return this.masterDataReadRepository.findAllSizes();
  }

  findSizeById(id: string): Promise<SizesEntity> {
    return this.sizesRepository.findById(id);
  }

  createSize(dto: CreateSizeDto): Promise<SizesEntity> {
    return this.sizesRepository.create(dto as unknown as SizesEntity);
  }

  updateSize(id: string, dto: UpdateSizeDto): Promise<SizesEntity> {
    return this.sizesRepository.update(id, dto as unknown as SizesEntity);
  }

  deleteSize(id: string): Promise<void> {
    return this.sizesRepository.delete(id);
  }
}
