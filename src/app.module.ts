import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrandsEntity } from './modules/master-data/entities/brands.entity';
import { CategoriesEntity } from './modules/master-data/entities/categories.entity';
import { CategoryGroupsEntity } from './modules/master-data/entities/categoryGroups.entity';
import { ColorsEntity } from './modules/master-data/entities/colors.entity';
import { ProductCategoriesEntity } from './modules/product/entites/productCategories.entity';
import { ProductsEntity } from './modules/product/entites/products.entity';
import { SizesEntity } from './modules/master-data/entities/sizes.entity';
import { SkusEntity } from './modules/inventory/entities/skus.entity';
import { ProductVariantsEntity } from './modules/product/entites/productVariants.entity';
import { MasterDataModule } from './modules/master-data/master-data.module';
import { ProductModule } from './modules/product/product.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersEntity } from './modules/user/entities/user.entity';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: (configService.get<string>('DB_HOST') ?? 'localhost').trim(),
        port: Number(configService.get<string>('DB_PORT') ?? 5432),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        models: [
          BrandsEntity,
          CategoryGroupsEntity,
          CategoriesEntity,
          ColorsEntity,
          ProductsEntity,
          ProductCategoriesEntity,
          ProductVariantsEntity,
          SizesEntity,
          SkusEntity,
          UsersEntity,
        ],
        autoLoadModels: true, 
        synchronize: false,
        logging: false,
      }),
    }),

    CoreModule,
    UserModule,
    AuthModule,
    MasterDataModule,
    ProductModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
