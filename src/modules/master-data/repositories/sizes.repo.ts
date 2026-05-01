import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SizesEntity } from '../entities/sizes.entity';

@Injectable()
export class SizesRepository {
  constructor(@InjectModel(SizesEntity) private sizesModel: typeof SizesEntity) {}

  async findAll(): Promise<SizesEntity[]> {
    return this.sizesModel.findAll();
  }

  async findById(id: string): Promise<SizesEntity> {
    const size = await this.sizesModel.findByPk(id);
    if (!size) {
      throw new NotFoundException('Size not found');
    }
    return size;
  }

  async create(size: SizesEntity): Promise<SizesEntity> {
    return this.sizesModel.create(size as any);
  }

  async update(id: string, size: SizesEntity): Promise<SizesEntity> {
    const [affectedCount] = await this.sizesModel.update(size as any, { where: { id } });
    if (affectedCount === 0) {
      throw new NotFoundException('Size not found');
    }
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this.sizesModel.destroy({ where: { id } });
    if (result === 0) {
      throw new NotFoundException('Size not found');
    }
    return;
  }
}               