import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

const SALT_ROUNDS = 10;

export interface CreateUserInput {
  email: string;
  password: string;
}

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<UsersEntity | null> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string): Promise<UsersEntity> {
    return this.userRepository.findById(id);
  }

  async create(input: CreateUserInput): Promise<UsersEntity> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
    return this.userRepository.create({ email: input.email, password: hashedPassword });
  }
}
