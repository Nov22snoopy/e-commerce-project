import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RestockDto } from './dto/restock.dto';
import { SkusEntity } from './entities/skus.entity';
import { InventoryService } from './inventory.service';

@ApiTags('Inventory')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('restock')
  @ApiOperation({ summary: 'Add stock to a SKU by skuCode' })
  addStock(@Body() dto: RestockDto): Promise<SkusEntity> {
    return this.inventoryService.addStock(dto);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get all SKUs with stock below 10' })
  getLowStock(): Promise<SkusEntity[]> {
    return this.inventoryService.getLowStock();
  }
}
