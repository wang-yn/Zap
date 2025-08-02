import { Project, ProjectStatus } from '../entities/project.entity'

/**
 * 项目仓储接口
 * 定义项目聚合根的持久化操作
 */
export interface ProjectRepository {
  /**
   * 根据ID查找项目
   */
  findById(id: string): Promise<Project | null>

  /**
   * 根据用户ID查找项目列表
   */
  findByUserId(userId: string): Promise<Project[]>

  /**
   * 根据用户ID分页查找项目
   */
  findByUserIdWithPagination(
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
  }>

  /**
   * 根据状态查找项目
   */
  findByStatus(status: ProjectStatus): Promise<Project[]>

  /**
   * 根据用户ID和状态查找项目
   */
  findByUserIdAndStatus(userId: string, status: ProjectStatus): Promise<Project[]>

  /**
   * 检查项目名称在用户下是否唯一
   */
  isNameUniqueForUser(userId: string, name: string, excludeProjectId?: string): Promise<boolean>

  /**
   * 保存项目（创建或更新）
   */
  save(project: Project): Promise<void>

  /**
   * 删除项目
   */
  delete(id: string): Promise<void>

  /**
   * 检查项目是否存在
   */
  exists(id: string): Promise<boolean>

  /**
   * 获取用户的项目统计信息
   */
  getProjectStats(userId: string): Promise<{
    total: number
    published: number
    draft: number
    archived: number
  }>

  /**
   * 批量删除用户的所有项目
   */
  deleteAllByUserId(userId: string): Promise<void>

  /**
   * 获取最近更新的项目
   */
  findRecentlyUpdated(userId: string, limit?: number): Promise<Project[]>
}
