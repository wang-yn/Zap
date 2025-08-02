import { Page as PrismaPage } from '@prisma/client';
import { Page } from '../../../domain/entities/page.entity';

/**
 * 页面实体与Prisma模型之间的映射器
 */
export class PageMapper {
  /**
   * 从Prisma模型转换为领域实体
   */
  static toDomain(prismaPage: PrismaPage): Page {
    return Page.fromPersistence({
      id: prismaPage.id,
      projectId: prismaPage.projectId,
      name: prismaPage.name,
      path: prismaPage.path,
      title: prismaPage.title,
      components: prismaPage.components as any[], // Prisma的Json类型
      layout: prismaPage.layout as any, // Prisma的Json类型
      isPublished: prismaPage.isPublished,
      createdAt: prismaPage.createdAt,
      updatedAt: prismaPage.updatedAt
    });
  }

  /**
   * 从领域实体转换为Prisma模型数据
   */
  static toPersistence(page: Page) {
    return page.toPersistence();
  }

  /**
   * 批量转换Prisma模型为领域实体
   */
  static toDomainList(prismaPages: PrismaPage[]): Page[] {
    return prismaPages.map(page => this.toDomain(page));
  }

  /**
   * 创建Prisma更新数据（只包含可更新的字段）
   */
  static toUpdateData(page: Page) {
    const persistence = page.toPersistence();
    return {
      name: persistence.name,
      path: persistence.path,
      title: persistence.title,
      components: persistence.components,
      layout: persistence.layout,
      isPublished: persistence.isPublished,
      updatedAt: persistence.updatedAt
    };
  }

  /**
   * 转换为公开的页面信息（用于API响应）
   */
  static toPublicInfo(page: Page) {
    return {
      id: page.id,
      projectId: page.projectId,
      name: page.name,
      path: page.path,
      title: page.title,
      isPublished: page.isPublished,
      componentCount: page.components.length,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt
    };
  }

  /**
   * 转换为渲染数据（用于预览）
   */
  static toRenderData(page: Page) {
    return {
      meta: {
        title: page.title || page.name,
        path: page.path
      },
      layout: page.layout.toJSON(),
      components: page.components.map(component => component.getRenderConfig())
    };
  }
}