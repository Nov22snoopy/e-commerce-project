import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ColorsEntity } from '../entities/colors.entity';

@Injectable()
export class ColorsRepository {
  constructor(@InjectModel(ColorsEntity) private colorsModel: typeof ColorsEntity) {}

  async findAll(): Promise<ColorsEntity[]> {
    return this.colorsModel.findAll();
  }

  async findById(id: string): Promise<ColorsEntity> {
    const color = await this.colorsModel.findByPk(id);
    if (!color) {
      throw new NotFoundException('Color not found');
    }
    return color;
  }

  async create(color: ColorsEntity): Promise<ColorsEntity> {
    return this.colorsModel.create(color as any);
  }

  async update(id: string, color: ColorsEntity): Promise<ColorsEntity> {
    const [affectedCount] = await this.colorsModel.update(color as any, { where: { id } });
    if (affectedCount === 0) {
      throw new NotFoundException('Color not found');
    }
    return this.findById(id);
  }    

  async delete(id: string): Promise<void> {
    const result = await this.colorsModel.destroy({ where: { id } });
    if (result === 0) {
      throw new NotFoundException('Color not found');
    }
    return;
  } 
  
}           