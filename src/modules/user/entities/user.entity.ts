import { Column, DataType, Default, Table, Unique } from 'sequelize-typescript';
import { BaseEntity } from '../../../core/database/base.entity';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Table({
  tableName: 'users',
  paranoid: true,
  underscored: true,
  indexes: [{ name: 'idx_users_email', unique: true, fields: ['email'] }],
})
export class UsersEntity extends BaseEntity {
  @Unique
  @Column({ type: DataType.STRING, allowNull: false, field: 'email' })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'password' })
  declare password: string;

  @Default(UserRole.USER)
  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
    field: 'role',
  })
  declare role: UserRole;
}
