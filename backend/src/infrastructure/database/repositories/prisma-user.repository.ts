import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username }
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmailOrUsername(emailOrUsername: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername }
        ]
      }
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async emailExists(email: string, excludeUserId?: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: {
        email,
        id: excludeUserId ? { not: excludeUserId } : undefined
      }
    });

    return count > 0;
  }

  async usernameExists(username: string, excludeUserId?: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: {
        username,
        id: excludeUserId ? { not: excludeUserId } : undefined
      }
    });

    return count > 0;
  }

  async save(user: User): Promise<void> {
    const data = UserMapper.toPersistence(user);

    await this.prisma.user.upsert({
      where: { id: data.id },
      create: data,
      update: {
        email: data.email,
        username: data.username,
        password: data.password,
        avatar: data.avatar,
        updatedAt: data.updatedAt
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { id }
    });

    return count > 0;
  }

  async findWithPagination(
    page: number,
    limit: number,
    search?: string
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    const where = search ? {
      OR: [
        { email: { contains: search, mode: 'insensitive' as const } },
        { username: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.user.count({ where })
    ]);

    return {
      users: UserMapper.toDomainList(users),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getUserStats(): Promise<{
    total: number;
    activeToday: number;
    newThisWeek: number;
    newThisMonth: number;
  }> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, newThisWeek, newThisMonth] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({
        where: { createdAt: { gte: startOfWeek } }
      }),
      this.prisma.user.count({
        where: { createdAt: { gte: startOfMonth } }
      })
    ]);

    return {
      total,
      activeToday: 0, // 需要额外的lastLoginAt字段才能实现
      newThisWeek,
      newThisMonth
    };
  }

  async findByCreatedDateRange(startDate: Date, endDate: Date): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return UserMapper.toDomainList(users);
  }

  async bulkDelete(userIds: string[]): Promise<void> {
    await this.prisma.user.deleteMany({
      where: {
        id: { in: userIds }
      }
    });
  }

  async updateLastLoginTime(userId: string): Promise<void> {
    // 注意：这需要在Prisma schema中添加lastLoginAt字段
    // 目前跳过实现
    console.log(`Would update last login time for user: ${userId}`);
  }

  async findRecentUsers(limit: number = 10): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    return UserMapper.toDomainList(users);
  }
}