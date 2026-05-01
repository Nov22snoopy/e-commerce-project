import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryGroupDto } from './dto/create-category-group.dto';
import { UpdateCategoryGroupDto } from './dto/update-category-group.dto';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { BrandsEntity } from './entities/brands.entity';
import { CategoriesEntity } from './entities/categories.entity';
import { CategoryGroupsEntity } from './entities/categoryGroups.entity';
import { ColorsEntity } from './entities/colors.entity';
import { SizesEntity } from './entities/sizes.entity';
import { MasterDataService } from './master-data.service';

@Controller('master-data')
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  // ── Brands ────────────────────────────────────────────────────────────────

  @Get('brands')
  @ApiTags('Brands')
  @ApiOperation({ summary: 'Get all brands' })
  getAllBrands(): Promise<BrandsEntity[]> {
    return this.masterDataService.findAllBrands();
  }

  @Get('brands/:id')
  @ApiTags('Brands')
  @ApiOperation({ summary: 'Get a brand by ID' })
  getBrand(@Param('id', ParseUUIDPipe) id: string): Promise<BrandsEntity> {
    return this.masterDataService.findBrandById(id);
  }

  @Post('brands')
  @ApiTags('Brands')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new brand' })
  createBrand(@Body() dto: CreateBrandDto): Promise<BrandsEntity> {
    return this.masterDataService.createBrand(dto);
  }

  @Patch('brands/:id')
  @ApiTags('Brands')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a brand by ID' })
  updateBrand(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBrandDto,
  ): Promise<BrandsEntity> {
    return this.masterDataService.updateBrand(id, dto);
  }

  @Delete('brands/:id')
  @ApiTags('Brands')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a brand by ID' })
  deleteBrand(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.masterDataService.deleteBrand(id);
  }

  // ── Category Groups ───────────────────────────────────────────────────────

  @Get('category-groups')
  @ApiTags('Category Groups')
  @ApiOperation({ summary: 'Get all category groups' })
  getAllCategoryGroups(): Promise<CategoryGroupsEntity[]> {
    return this.masterDataService.findAllCategoryGroups();
  }

  @Get('category-groups/:id')
  @ApiTags('Category Groups')
  @ApiOperation({ summary: 'Get a category group by ID' })
  getCategoryGroup(@Param('id', ParseUUIDPipe) id: string): Promise<CategoryGroupsEntity> {
    return this.masterDataService.findCategoryGroupById(id);
  }

  @Post('category-groups')
  @ApiTags('Category Groups')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new category group' })
  createCategoryGroup(@Body() dto: CreateCategoryGroupDto): Promise<CategoryGroupsEntity> {
    return this.masterDataService.createCategoryGroup(dto);
  }

  @Patch('category-groups/:id')
  @ApiTags('Category Groups')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a category group by ID' })
  updateCategoryGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryGroupDto,
  ): Promise<CategoryGroupsEntity> {
    return this.masterDataService.updateCategoryGroup(id, dto);
  }

  @Delete('category-groups/:id')
  @ApiTags('Category Groups')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a category group by ID' })
  deleteCategoryGroup(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.masterDataService.deleteCategoryGroup(id);
  }

  // ── Categories ────────────────────────────────────────────────────────────

  @Get('categories')
  @ApiTags('Categories')
  @ApiOperation({ summary: 'Get all categories' })
  getAllCategories(): Promise<CategoriesEntity[]> {
    return this.masterDataService.findAllCategories();
  }

  @Get('categories/:id')
  @ApiTags('Categories')
  @ApiOperation({ summary: 'Get a category by ID' })
  getCategory(@Param('id', ParseUUIDPipe) id: string): Promise<CategoriesEntity> {
    return this.masterDataService.findCategoryById(id);
  }

  @Post('categories')
  @ApiTags('Categories')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new category' })
  createCategory(@Body() dto: CreateCategoryDto): Promise<CategoriesEntity> {
    return this.masterDataService.createCategory(dto);
  }

  @Patch('categories/:id')
  @ApiTags('Categories')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a category by ID' })
  updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoriesEntity> {
    return this.masterDataService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @ApiTags('Categories')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a category by ID' })
  deleteCategory(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.masterDataService.deleteCategory(id);
  }

  // ── Colors ────────────────────────────────────────────────────────────────

  @Get('colors')
  @ApiTags('Colors')
  @ApiOperation({ summary: 'Get all colors' })
  getAllColors(): Promise<ColorsEntity[]> {
    return this.masterDataService.findAllColors();
  }

  @Get('colors/:id')
  @ApiTags('Colors')
  @ApiOperation({ summary: 'Get a color by ID' })
  getColor(@Param('id', ParseUUIDPipe) id: string): Promise<ColorsEntity> {
    return this.masterDataService.findColorById(id);
  }

  @Post('colors')
  @ApiTags('Colors')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new color' })
  createColor(@Body() dto: CreateColorDto): Promise<ColorsEntity> {
    return this.masterDataService.createColor(dto);
  }

  @Patch('colors/:id')
  @ApiTags('Colors')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a color by ID' })
  updateColor(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateColorDto,
  ): Promise<ColorsEntity> {
    return this.masterDataService.updateColor(id, dto);
  }

  @Delete('colors/:id')
  @ApiTags('Colors')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a color by ID' })
  deleteColor(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.masterDataService.deleteColor(id);
  }

  // ── Sizes ─────────────────────────────────────────────────────────────────

  @Get('sizes')
  @ApiTags('Sizes')
  @ApiOperation({ summary: 'Get all sizes' })
  getAllSizes(): Promise<SizesEntity[]> {
    return this.masterDataService.findAllSizes();
  }

  @Get('sizes/:id')
  @ApiTags('Sizes')
  @ApiOperation({ summary: 'Get a size by ID' })
  getSize(@Param('id', ParseUUIDPipe) id: string): Promise<SizesEntity> {
    return this.masterDataService.findSizeById(id);
  }

  @Post('sizes')
  @ApiTags('Sizes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new size' })
  createSize(@Body() dto: CreateSizeDto): Promise<SizesEntity> {
    return this.masterDataService.createSize(dto);
  }

  @Patch('sizes/:id')
  @ApiTags('Sizes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a size by ID' })
  updateSize(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSizeDto,
  ): Promise<SizesEntity> {
    return this.masterDataService.updateSize(id, dto);
  }

  @Delete('sizes/:id')
  @ApiTags('Sizes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a size by ID' })
  deleteSize(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.masterDataService.deleteSize(id);
  }
}
