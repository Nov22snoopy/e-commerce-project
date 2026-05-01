import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UsersEntity) private readonly usersModel: typeof UsersEntity,
  ) {}

  async findByEmail(email: string): Promise<UsersEntity | null> {
    return this.usersModel.findOne({ where: { email } });
  }

  async findById(id: string): Promise<UsersEntity> {
    const user = await this.usersModel.findByPk(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: Pick<UsersEntity, 'email' | 'password'>): Promise<UsersEntity> {
    return this.usersModel.create(data as any);
  }
}
