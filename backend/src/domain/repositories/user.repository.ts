import { User } from '../entities/user.entity'

/**
 * 用户仓储接口
 * 定义用户聚合根的持久化操作
 */
export interface UserRepository {
  /**
   * 根据ID查找用户
   */
  findById(id: string): Promise<User | null>

  /**
   * 根据邮箱查找用户
   */
  findByEmail(email: string): Promise<User | null>

  /**
   * 根据用户名查找用户
   */
  findByUsername(username: string): Promise<User | null>

  /**
   * 根据邮箱或用户名查找用户（用于登录）
   */
  findByEmailOrUsername(emailOrUsername: string): Promise<User | null>

  /**
   * 检查邮箱是否已存在
   */
  emailExists(email: string, excludeUserId?: string): Promise<boolean>

  /**
   * 检查用户名是否已存在
   */
  usernameExists(username: string, excludeUserId?: string): Promise<boolean>

  /**
   * 保存用户（创建或更新）
   */
  save(user: User): Promise<void>

  /**
   * 删除用户
   */
  delete(id: string): Promise<void>

  /**
   * 检查用户是否存在
   */
  exists(id: string): Promise<boolean>

  /**
   * 分页查找用户（管理员功能）
   */
  findWithPagination(
    page: number,
    limit: number,
    search?: string
  ): Promise<{
    users: User[]
    total: number
    page: number
    limit: number
    totalPages: number
  }>

  /**
   * 获取用户统计信息
   */
  getUserStats(): Promise<{
    total: number
    activeToday: number
    newThisWeek: number
    newThisMonth: number
  }>

  /**
   * 根据创建时间范围查找用户
   */
  findByCreatedDateRange(startDate: Date, endDate: Date): Promise<User[]>

  /**
   * 批量删除用户
   */
  bulkDelete(userIds: string[]): Promise<void>

  /**
   * 更新用户最后登录时间
   */
  updateLastLoginTime(userId: string): Promise<void>

  /**
   * 查找最近注册的用户
   */
  findRecentUsers(limit?: number): Promise<User[]>
}
