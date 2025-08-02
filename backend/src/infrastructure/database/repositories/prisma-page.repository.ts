import { Injectable } from '@nestjs/common';
import { PageRepository } from '../../../domain/repositories/page.repository';
import { Page } from '../../../domain/entities/page.entity';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { PageMapper } from '../mappers/page.mapper';

@Injectable()
export class PrismaPageRepository implements PageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Page | null> {
    const page = await this.prisma.page.findUnique({
      where: { id }
    });

    return page ? PageMapper.toDomain(page) : null;
  }

  async findByProjectId(projectId: string): Promise<Page[]> {
    const pages = await this.prisma.page.findMany({
      where: { projectId },
      orderBy: { updatedAt: 'desc' }
    });

    return PageMapper.toDomainList(pages);
  }

  async findByProjectIdAndPath(projectId: string, path: string): Promise<Page | null> {
    const page = await this.prisma.page.findFirst({
      where: { projectId, path }
    });

    return page ? PageMapper.toDomain(page) : null;
  }

  async findPublishedByProjectId(projectId: string): Promise<Page[]> {
    const pages = await this.prisma.page.findMany({
      where: { 
        projectId, 
        isPublished: true 
      },
      orderBy: { updatedAt: 'desc' }
    });

    return PageMapper.toDomainList(pages);
  }

  async findByProjectIdWithPagination(
    projectId: string,
    page: number,
    limit: number,
    search?: string
  ): Promise<{
    pages: Page[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    const where = {
      projectId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { path: { contains: search, mode: 'insensitive' as const } },
          { title: { contains: search, mode: 'insensitive' as const } }
        ]
      })
    };

    const [pages, total] = await Promise.all([
      this.prisma.page.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' }
      }),
      this.prisma.page.count({ where })
    ]);

    return {
      pages: PageMapper.toDomainList(pages),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async isPathUniqueInProject(projectId: string, path: string, excludePageId?: string): Promise<boolean> {
    const count = await this.prisma.page.count({
      where: {
        projectId,
        path,
        id: excludePageId ? { not: excludePageId } : undefined
      }
    });

    return count === 0;
  }

  async isNameUniqueInProject(projectId: string, name: string, excludePageId?: string): Promise<boolean> {
    const count = await this.prisma.page.count({
      where: {
        projectId,
        name,
        id: excludePageId ? { not: excludePageId } : undefined
      }
    });

    return count === 0;
  }

  async save(page: Page): Promise<void> {
    const data = PageMapper.toPersistence(page);

    await this.prisma.page.upsert({
      where: { id: data.id },
      create: data,
      update: PageMapper.toUpdateData(page)
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.page.delete({
      where: { id }
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.page.count({
      where: { id }
    });

    return count > 0;
  }

  async deleteAllByProjectId(projectId: string): Promise<void> {
    await this.prisma.page.deleteMany({
      where: { projectId }
    });
  }

  async getPageStats(projectId: string): Promise<{
    total: number;
    published: number;
    draft: number;
    totalComponents: number;
  }> {
    const pages = await this.prisma.page.findMany({
      where: { projectId },
      select: {
        isPublished: true,
        components: true
      }
    });

    const total = pages.length;
    const published = pages.filter(p => p.isPublished).length;
    const draft = total - published;
    
    // 计算总组件数
    const totalComponents = pages.reduce((sum, page) => {
      const components = page.components as any[];
      return sum + (Array.isArray(components) ? components.length : 0);
    }, 0);

    return { total, published, draft, totalComponents };
  }

  async findPagesWithComponentType(componentType: string): Promise<Page[]> {
    // 使用Prisma的JSON查询功能
    const pages = await this.prisma.page.findMany({
      where: {
        components: {
          array_contains: [{ type: componentType }]
        }
      }
    });

    return PageMapper.toDomainList(pages);
  }

  async findRecentlyUpdated(projectId: string, limit: number = 5): Promise<Page[]> {
    const pages = await this.prisma.page.findMany({
      where: { projectId },
      take: limit,
      orderBy: { updatedAt: 'desc' }
    });

    return PageMapper.toDomainList(pages);
  }

  async copyToProject(
    pageId: string, 
    targetProjectId: string, 
    newName?: string, 
    newPath?: string
  ): Promise<Page> {
    const sourcePage = await this.findById(pageId);
    if (!sourcePage) {
      throw new Error('Source page not found');
    }

    // 创建新页面（通过领域实体）
    const newPage = Page.create({
      projectId: targetProjectId,
      name: newName || `${sourcePage.name} (副本)`,
      path: newPath || `${sourcePage.path}-copy`,
      title: sourcePage.title
    });

    // 复制布局
    newPage.updateLayout(sourcePage.layout);

    // 复制组件
    sourcePage.components.forEach(component => {
      newPage.addComponent(component.type, component.props.values);
    });

    // 保存新页面
    await this.save(newPage);

    return newPage;
  }

  async bulkUpdatePublishStatus(pageIds: string[], isPublished: boolean): Promise<void> {
    await this.prisma.page.updateMany({
      where: {
        id: { in: pageIds }
      },
      data: {
        isPublished,
        updatedAt: new Date()
      }
    });
  }
}