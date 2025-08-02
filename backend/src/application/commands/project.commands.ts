import { ProjectConfig } from '../../domain/value-objects/project-config.vo'

/**
 * 创建项目命令
 */
export interface CreateProjectCommand {
  name: string
  description?: string
  userId: string
  config?: ProjectConfig
}

/**
 * 更新项目命令
 */
export interface UpdateProjectCommand {
  projectId: string
  userId: string // 用于权限验证
  name?: string
  description?: string
  config?: ProjectConfig
}

/**
 * 发布项目命令
 */
export interface PublishProjectCommand {
  projectId: string
  userId: string // 用于权限验证
}

/**
 * 删除项目命令
 */
export interface DeleteProjectCommand {
  projectId: string
  userId: string // 用于权限验证
}

/**
 * 复制项目命令
 */
export interface DuplicateProjectCommand {
  sourceProjectId: string
  newName: string
  userId: string
  newDescription?: string
}

/**
 * 归档项目命令
 */
export interface ArchiveProjectCommand {
  projectId: string
  userId: string // 用于权限验证
}
