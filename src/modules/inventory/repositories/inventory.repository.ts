import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { SkusEntity } from '../entities/skus.entity';

const LOW_STOCK_THRESHOLD = 10;

@Injectable()
export class InventoryRepository {
  constructor(
    @InjectModel(SkusEntity) private readonly skusModel: typeof SkusEntity,
  ) {}

  async findBySkuCode(skuCode: string): Promise<SkusEntity> {
    const sku = await this.skusModel.findOne({ where: { skuCode } });
    if (!sku) throw new NotFoundException(`SKU "${skuCode}" not found`);
    return sku;
  }

  async incrementStock(skuCode: string, quantity: number): Promise<SkusEntity> {
    const sku = await this.findBySkuCode(skuCode);
    await sku.increment('stock', { by: quantity });
    return sku.reload();
  }

  async findLowStock(): Promise<SkusEntity[]> {
    return this.skusModel.findAll({
      where: { stock: { [Op.lt]: LOW_STOCK_THRESHOLD } },
    });
  }
}
