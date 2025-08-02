import { Page } from '../entities/page.entity';

/**
 * 页面仓储接口
 * 定义页面聚合根的持久化操作
 */
export interface PageRepository {
  /**
   * 根据ID查找页面
   */
  findById(id: string): Promise<Page | null>;

  /**
   * 根据项目ID查找所有页面
   */
  findByProjectId(projectId: string): Promise<Page[]>;

  /**
   * 根据项目ID和路径查找页面
   */
  findByProjectIdAndPath(projectId: string, path: string): Promise<Page | null>;

  /**
   * 根据项目ID查找已发布的页面
   */
  findPublishedByProjectId(projectId: string): Promise<Page[]>;

  /**
   * 根据项目ID分页查找页面
   */
  findByProjectIdWithPagination(
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
  }>;

  /**
   * 检查路径在项目下是否唯一
   */
  isPathUniqueInProject(projectId: string, path: string, excludePageId?: string): Promise<boolean>;

  /**
   * 检查页面名称在项目下是否唯一
   */
  isNameUniqueInProject(projectId: string, name: string, excludePageId?: string): Promise<boolean>;

  /**
   * 保存页面（创建或更新）
   */
  save(page: Page): Promise<void>;

  /**
   * 删除页面
   */
  delete(id: string): Promise<void>;

  /**
   * 检查页面是否存在
   */
  exists(id: string): Promise<boolean>;

  /**
   * 批量删除项目下的所有页面
   */
  deleteAllByProjectId(projectId: string): Promise<void>;

  /**
   * 获取项目的页面统计信息
   */
  getPageStats(projectId: string): Promise<{
    total: number;
    published: number;
    draft: number;
    totalComponents: number;
  }>;

  /**
   * 查找包含指定组件类型的页面
   */
  findPagesWithComponentType(componentType: string): Promise<Page[]>;

  /**
   * 获取最近更新的页面
   */
  findRecentlyUpdated(projectId: string, limit?: number): Promise<Page[]>;

  /**
   * 复制页面到另一个项目
   */
  copyToProject(pageId: string, targetProjectId: string, newName?: string, newPath?: string): Promise<Page>;

  /**
   * 批量更新页面的发布状态
   */
  bulkUpdatePublishStatus(pageIds: string[], isPublished: boolean): Promise<void>;
}