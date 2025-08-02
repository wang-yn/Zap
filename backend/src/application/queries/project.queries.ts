import { ProjectStatus } from '../../domain/entities/project.entity'

/**
 * 查询项目详情
 */
export interface GetProjectQuery {
  projectId: string
  userId: string // 用于权限验证
}

/**
 * 查询用户项目列表
 */
export interface GetUserProjectsQuery {
  userId: string
  status?: ProjectStatus
  search?: string
  page?: number
  limit?: number
}

/**
 * 查询项目及其页面
 */
export interface GetProjectWithPagesQuery {
  projectId: string
  userId: string // 用于权限验证
  includeUnpublished?: boolean
}

/**
 * 查询项目统计信息
 */
export interface GetProjectStatsQuery {
  userId: string
}

/**
 * 查询最近更新的项目
 */
export interface GetRecentProjectsQuery {
  userId: string
  limit?: number
}
