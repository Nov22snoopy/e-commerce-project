import { NotFoundException } from '@nestjs/common';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { InventoryService } from './inventory.service';
import { InventoryRepository } from './repositories/inventory.repository';
import { SkusEntity } from './entities/skus.entity';

function buildSku(overrides: Partial<Pick<SkusEntity, 'skuCode' | 'stock'>> = {}): SkusEntity {
  return Object.assign(
    Object.create(SkusEntity.prototype) as SkusEntity,
    { skuCode: 'SKU-1', stock: 0 },
    overrides,
  );
}

describe('InventoryService', () => {
  let service: InventoryService;
  let mockedRepo: InventoryRepository;

  beforeEach(() => {
    mockedRepo = mock(InventoryRepository);
    service = new InventoryService(instance(mockedRepo));
  });

  describe('addStock', () => {
    it('should throw NotFoundException when SKU does not exist', async () => {
      // Arrange
      const dto = { skuCode: 'MISSING', quantity: 5 };
      when(mockedRepo.incrementStock(dto.skuCode, dto.quantity)).thenReject(
        new NotFoundException(`SKU "${dto.skuCode}" not found`),
      );

      // Act
      const act = service.addStock(dto);

      // Assert
      await expect(act).rejects.toThrow(NotFoundException);
      verify(mockedRepo.incrementStock(dto.skuCode, dto.quantity)).once();
    });

    it('should increment stock and return updated SKU (happy path)', async () => {
      // Arrange
      const dto = { skuCode: 'SKU-1', quantity: 3 };
      const updatedSku = buildSku({ skuCode: dto.skuCode, stock: 10 });
      when(mockedRepo.incrementStock(dto.skuCode, dto.quantity)).thenResolve(updatedSku);

      // Act
      const result = await service.addStock(dto);

      // Assert
      expect(result).toBe(updatedSku);
      verify(mockedRepo.incrementStock(dto.skuCode, dto.quantity)).once();
      verify(mockedRepo.incrementStock(anything(), anything())).once();
    });
  });
});

