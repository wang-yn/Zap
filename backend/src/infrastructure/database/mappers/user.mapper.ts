import { User as PrismaUser } from '@prisma/client';
import { User } from '../../../domain/entities/user.entity';

/**
 * 用户实体与Prisma模型之间的映射器
 */
export class UserMapper {
  /**
   * 从Prisma模型转换为领域实体
   */
  static toDomain(prismaUser: PrismaUser): User {
    return User.fromPersistence({
      id: prismaUser.id,
      email: prismaUser.email,
      username: prismaUser.username,
      password: prismaUser.password,
      avatar: prismaUser.avatar,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt
    });
  }

  /**
   * 从领域实体转换为Prisma模型数据
   */
  static toPersistence(user: User) {
    return user.toPersistence();
  }

  /**
   * 批量转换Prisma模型为领域实体
   */
  static toDomainList(prismaUsers: PrismaUser[]): User[] {
    return prismaUsers.map(user => this.toDomain(user));
  }
}