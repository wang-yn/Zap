import { Injectable } from '@nestjs/common'
import { ProjectRepository } from '../../../domain/repositories/project.repository'
import { Project, ProjectStatus } from '../../../domain/entities/project.entity'
import { PrismaService } from '../../../common/prisma/prisma.service'
import { ProjectMapper } from '../mappers/project.mapper'
import { ProjectStatus as PrismaProjectStatus } from '@prisma/client'

@Injectable()
export class PrismaProjectRepository implements ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    })

    return project ? ProjectMapper.toDomain(project) : null
  }

  async findByUserId(userId: string): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    })

    return ProjectMapper.toDomainList(projects)
  }

  async findByUserIdWithPagination(
    userId: string,
    page: number,
    limit: number,
    search?: string
  ): Promise<{
    projects: Project[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const skip = (page - 1) * limit

    const where = {
      userId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    }

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.project.count({ where }),
    ])

    return {
      projects: ProjectMapper.toDomainList(projects),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findByStatus(status: ProjectStatus): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: { status: status as PrismaProjectStatus },
      orderBy: { updatedAt: 'desc' },
    })

    return ProjectMapper.toDomainList(projects)
  }

  async findByUserIdAndStatus(userId: string, status: ProjectStatus): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: { userId, status: status as PrismaProjectStatus },
      orderBy: { updatedAt: 'desc' },
    })

    return ProjectMapper.toDomainList(projects)
  }

  async isNameUniqueForUser(
    userId: string,
    name: string,
    excludeProjectId?: string
  ): Promise<boolean> {
    const count = await this.prisma.project.count({
      where: {
        userId,
        name,
        id: excludeProjectId ? { not: excludeProjectId } : undefined,
      },
    })

    return count === 0
  }

  async save(project: Project): Promise<void> {
    const data = ProjectMapper.toPersistence(project)

    await this.prisma.project.upsert({
      where: { id: data.id },
      create: {
        id: data.id,
        name: data.name,
        description: data.description,
        userId: data.userId,
        status: data.status,
        config: data.config,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      update: {
        name: data.name,
        description: data.description,
        status: data.status,
        config: data.config,
        updatedAt: data.updatedAt,
      },
    })
  }

  async delete(id: string): Promise<void> {
    // 先删除相关的页面（如果有级联删除配置可以跳过）
    await this.prisma.page.deleteMany({
      where: { projectId: id },
    })

    // 删除项目
    await this.prisma.project.delete({
      where: { id },
    })
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.project.count({
      where: { id },
    })

    return count > 0
  }

  async getProjectStats(userId: string): Promise<{
    total: number
    published: number
    draft: number
    archived: number
  }> {
    const [total, published, draft, archived] = await Promise.all([
      this.prisma.project.count({ where: { userId } }),
      this.prisma.project.count({ where: { userId, status: PrismaProjectStatus.PUBLISHED } }),
      this.prisma.project.count({ where: { userId, status: PrismaProjectStatus.DRAFT } }),
      this.prisma.project.count({ where: { userId, status: PrismaProjectStatus.ARCHIVED } }),
    ])

    return { total, published, draft, archived }
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    // 先删除所有项目下的页面
    await this.prisma.page.deleteMany({
      where: {
        project: { userId },
      },
    })

    // 删除所有项目
    await this.prisma.project.deleteMany({
      where: { userId },
    })
  }

  async findRecentlyUpdated(userId: string, limit: number = 5): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: { userId },
      take: limit,
      orderBy: { updatedAt: 'desc' },
    })

    return ProjectMapper.toDomainList(projects)
  }
}
