import { Injectable } from '@nestjs/common';
import { RestockDto } from './dto/restock.dto';
import { InventoryRepository } from './repositories/inventory.repository';
import { SkusEntity } from './entities/skus.entity';

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async addStock(dto: RestockDto): Promise<SkusEntity> {
    return this.inventoryRepository.incrementStock(dto.skuCode, dto.quantity);
  }

  async getLowStock(): Promise<SkusEntity[]> {
    return this.inventoryRepository.findLowStock();
  }
}
