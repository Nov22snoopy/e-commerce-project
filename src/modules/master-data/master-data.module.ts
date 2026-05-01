import { Module } from '@nestjs/common';
import { MasterDataController } from './master-data.controller';
import { MasterDataService } from './master-data.service';
import { MasterDataReadRepository } from './repositories/master-data-read.repo';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriesEntity } from './entities/categories.entity';
import { CategoryGroupsEntity } from './entities/categoryGroups.entity';
import { ColorsEntity } from './entities/colors.entity';
import { SizesEntity } from './entities/sizes.entity';
import { BrandsEntity } from './entities/brands.entity';
import { CategoriesRepository } from './repositories/category.repo';
import { CategoryGroupsRepository } from './repositories/categoryGroup.repo';
import { ColorsRepository } from './repositories/colors.repo';
import { SizesRepository } from './repositories/sizes.repo';
import { BrandsRepository } from './repositories/brands.repo';

@Module({
  imports: [SequelizeModule.forFeature([CategoriesEntity, CategoryGroupsEntity, ColorsEntity, SizesEntity, BrandsEntity])],
  controllers: [MasterDataController],
  providers: [
    MasterDataService,
    MasterDataReadRepository,
    CategoriesRepository,
    CategoryGroupsRepository,
    ColorsRepository,
    SizesRepository,
    BrandsRepository,
  ],
})
export class MasterDataModule {}