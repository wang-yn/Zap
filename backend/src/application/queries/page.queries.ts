/**
 * 查询页面详情
 */
export interface GetPageQuery {
  pageId: string
  userId: string // 用于权限验证
}

/**
 * 查询项目页面列表
 */
export interface GetProjectPagesQuery {
  projectId: string
  userId: string // 用于权限验证
  includeUnpublished?: boolean
  search?: string
  page?: number
  limit?: number
}

/**
 * 查询页面统计信息
 */
export interface GetPageStatsQuery {
  projectId: string
  userId: string // 用于权限验证
}

/**
 * 查询最近更新的页面
 */
export interface GetRecentPagesQuery {
  projectId: string
  userId: string // 用于权限验证
  limit?: number
}

/**
 * 预览页面查询（包含完整渲染数据）
 */
export interface PreviewPageQuery {
  pageId: string
  userId: string // 用于权限验证
}
