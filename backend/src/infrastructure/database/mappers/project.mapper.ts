import { Project as PrismaProject, Page as PrismaPage } from '@prisma/client';
import { Project } from '../../../domain/entities/project.entity';
import { PageMapper } from './page.mapper';

/**
 * 项目实体与Prisma模型之间的映射器
 */
export class ProjectMapper {
  /**
   * 从Prisma模型转换为领域实体（不包含页面）
   */
  static toDomain(prismaProject: PrismaProject): Project {
    return Project.fromPersistence({
      id: prismaProject.id,
      name: prismaProject.name,
      description: prismaProject.description,
      userId: prismaProject.userId,
      status: prismaProject.status,
      config: prismaProject.config,
      createdAt: prismaProject.createdAt,
      updatedAt: prismaProject.updatedAt
    });
  }

  /**
   * 从Prisma模型转换为领域实体（包含页面）
   */
  static toDomainWithPages(
    prismaProject: PrismaProject & { pages?: PrismaPage[] }
  ): Project {
    const project = this.toDomain(prismaProject);
    
    // 注意：这里只是设置基本信息，页面需要通过领域方法添加
    // 因为领域实体不应该直接设置内部状态
    return project;
  }

  /**
   * 从领域实体转换为Prisma模型数据
   */
  static toPersistence(project: Project) {
    const persistence = project.toPersistence();
    return {
      id: persistence.id,
      name: persistence.name,
      description: persistence.description,
      userId: persistence.userId,
      status: persistence.status,
      config: persistence.config,
      createdAt: persistence.createdAt,
      updatedAt: persistence.updatedAt
    };
  }

  /**
   * 批量转换Prisma模型为领域实体
   */
  static toDomainList(prismaProjects: PrismaProject[]): Project[] {
    return prismaProjects.map(project => this.toDomain(project));
  }
}