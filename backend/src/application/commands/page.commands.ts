import { PageLayout } from '../../domain/value-objects/page-layout.vo'
import { ComponentType } from '../../domain/types/component.types'

/**
 * 创建页面命令
 */
export interface CreatePageCommand {
  projectId: string
  name: string
  path: string
  title?: string
  userId: string // 用于权限验证
  layout?: PageLayout
}

/**
 * 更新页面命令
 */
export interface UpdatePageCommand {
  pageId: string
  userId: string // 用于权限验证
  name?: string
  path?: string
  title?: string
  layout?: PageLayout
}

/**
 * 发布页面命令
 */
export interface PublishPageCommand {
  pageId: string
  userId: string // 用于权限验证
}

/**
 * 取消发布页面命令
 */
export interface UnpublishPageCommand {
  pageId: string
  userId: string // 用于权限验证
}

/**
 * 删除页面命令
 */
export interface DeletePageCommand {
  pageId: string
  userId: string // 用于权限验证
}

/**
 * 添加组件命令
 */
export interface AddComponentCommand {
  pageId: string
  componentType: ComponentType
  props: Record<string, any>
  position?: number
  userId: string // 用于权限验证
}

/**
 * 更新组件命令
 */
export interface UpdateComponentCommand {
  pageId: string
  componentId: string
  props: Record<string, any>
  userId: string // 用于权限验证
}

/**
 * 删除组件命令
 */
export interface RemoveComponentCommand {
  pageId: string
  componentId: string
  userId: string // 用于权限验证
}

/**
 * 重新排序组件命令
 */
export interface ReorderComponentsCommand {
  pageId: string
  componentIds: string[]
  userId: string // 用于权限验证
}

/**
 * 复制页面命令
 */
export interface CopyPageCommand {
  sourcePageId: string
  targetProjectId: string
  newName: string
  newPath: string
  userId: string // 用于权限验证
}
