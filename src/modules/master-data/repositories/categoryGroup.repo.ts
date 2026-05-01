import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryGroupsEntity } from '../entities/categoryGroups.entity';

@Injectable()
export class CategoryGroupsRepository {
  constructor(@InjectModel(CategoryGroupsEntity) private categoryGroupsModel: typeof CategoryGroupsEntity) {}

  async findAll(): Promise<CategoryGroupsEntity[]> {
    return this.categoryGroupsModel.findAll();
  }

  async findById(id: string): Promise<CategoryGroupsEntity> {
    const categoryGroup = await this.categoryGroupsModel.findByPk(id);
    if (!categoryGroup) {
      throw new NotFoundException('Category group not found');
    }
    return categoryGroup;
  }

  async create(categoryGroup: CategoryGroupsEntity): Promise<CategoryGroupsEntity> {
    return this.categoryGroupsModel.create(categoryGroup as any);
  }

  async update(id: string, categoryGroup: CategoryGroupsEntity): Promise<CategoryGroupsEntity> {
    const [affectedCount] = await this.categoryGroupsModel.update(categoryGroup as any, { where: { id } });
    if (affectedCount === 0) {
      throw new NotFoundException('Category group not found');
    }
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this.categoryGroupsModel.destroy({ where: { id } });
    if (result === 0) {
      throw new NotFoundException('Category group not found');
    }
    return;
  }
}               