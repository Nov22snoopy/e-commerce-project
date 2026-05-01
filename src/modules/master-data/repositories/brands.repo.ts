import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BrandsEntity } from '../entities/brands.entity';

@Injectable()
export class BrandsRepository {
  constructor(@InjectModel(BrandsEntity) private brandsModel: typeof BrandsEntity) {}

  async findAll(): Promise<BrandsEntity[]> {
    return this.brandsModel.findAll();
  }

  async findById(id: string): Promise<BrandsEntity> {
    const brand = await this.brandsModel.findByPk(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand;
  }

  async create(brand: BrandsEntity): Promise<BrandsEntity> {
    return this.brandsModel.create(brand as any);
  }

  async update(id: string, brand: BrandsEntity): Promise<BrandsEntity> {
    const [affectedCount] = await this.brandsModel.update(brand as any, { where: { id } });
    if (affectedCount === 0) {
      throw new NotFoundException('Brand not found');
    }
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this.brandsModel.destroy({ where: { id } });
    if (result === 0) {
      throw new NotFoundException('Brand not found');
    }
    return;
  }
}           