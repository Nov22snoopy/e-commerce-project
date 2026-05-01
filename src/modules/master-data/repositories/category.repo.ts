import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoriesEntity } from '../entities/categories.entity';
import { CategoryGroupsEntity } from '../entities/categoryGroups.entity';

@Injectable()
export class CategoriesRepository {
  constructor(@InjectModel(CategoriesEntity) private categoriesModel: typeof CategoriesEntity) {}

  async findAll(): Promise<CategoriesEntity[]> {
    return this.categoriesModel.findAll({
      include: [
        {
          model: CategoryGroupsEntity,
          as: 'group',
        },
      ],
    });
  }

  async findById(id: string): Promise<CategoriesEntity> {
    const category = await this.categoriesModel.findByPk(id, {
      include: [
        {
          model: CategoryGroupsEntity,
          as: 'group',
        },
      ],
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async create(category: CategoriesEntity): Promise<CategoriesEntity> {
    return this.categoriesModel.create(category as any);
  }

  async update(id: string, category: CategoriesEntity): Promise<CategoriesEntity> {
    const [affectedCount] = await this.categoriesModel.update(category as any, { where: { id } });
    if (affectedCount === 0) {
      throw new NotFoundException('Category not found');
    }
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this.categoriesModel.destroy({ where: { id } });
    if (result === 0) {
      throw new NotFoundException('Category not found');
    }
    return;
  }
}           