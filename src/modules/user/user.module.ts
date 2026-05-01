import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './user.service';

@Module({
  imports: [SequelizeModule.forFeature([UsersEntity])],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
