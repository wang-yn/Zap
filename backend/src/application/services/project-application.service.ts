import { Injectable, Inject } from '@nestjs/common'
import { ProjectRepository } from '../../domain/repositories/project.repository'
import { UserRepository } from '../../domain/repositories/user.repository'
import { DomainEventDispatcher } from '../../domain/events/domain-event'
import { Project } from '../../domain/entities/project.entity'
import { DomainError } from '../../domain/errors/domain-error'
import {
  USER_REPOSITORY,
  PROJECT_REPOSITORY,
  DOMAIN_EVENT_DISPATCHER,
} from '../../common/constants/injection-tokens'
import {
  CreateProjectCommand,
  UpdateProjectCommand,
  PublishProjectCommand,
  DeleteProjectCommand,
} from '../commands/project.commands'
import {
  GetProjectQuery,
  GetUserProjectsQuery,
  GetProjectStatsQuery,
  GetRecentProjectsQuery,
} from '../queries/project.queries'

/**
 * 应用服务结果类型
 */
export interface ApplicationResult<T = any> {
  success: boolean
  data?: T
  error?: string
  errors?: string[]
}

@Injectable()
export class ProjectApplicationService {
  constructor(
    @Inject(PROJECT_REPOSITORY) private readonly projectRepository: ProjectRepository,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(DOMAIN_EVENT_DISPATCHER) private readonly eventDispatcher: DomainEventDispatcher
  ) {}

  /**
   * 创建项目
   */
  async createProject(
    command: CreateProjectCommand
  ): Promise<ApplicationResult<{ projectId: string }>> {
    try {
      // 验证用户存在
      const user = await this.userRepository.findById(command.userId)
      if (!user) {
        return { success: false, error: '用户不存在' }
      }

      // 检查项目名称是否重复
      const isNameUnique = await this.projectRepository.isNameUniqueForUser(
        command.userId,
        command.name
      )
      if (!isNameUnique) {
        return { success: false, error: '项目名称已存在' }
      }

      // 创建项目
      const project = Project.create({
        name: command.name,
        description: command.description,
        userId: command.userId,
        config: command.config,
      })

      // 保存项目
      await this.projectRepository.save(project)

      // 分发领域事件
      await this.eventDispatcher.dispatchEvents(project.domainEvents)
      project.clearDomainEvents()

      return {
        success: true,
        data: { projectId: project.id },
      }
    } catch (error) {
      if (error instanceof DomainError) {
        return { success: false, error: error.message }
      }
      throw error
    }
  }

  /**
   * 更新项目
   */
  async updateProject(command: UpdateProjectCommand): Promise<ApplicationResult> {
    try {
      const project = await this.projectRepository.findById(command.projectId)
      if (!project) {
        return { success: false, error: '项目不存在' }
      }

      // 权限检查
      if (project.userId !== command.userId) {
        return { success: false, error: '无权限操作此项目' }
      }

      // 更新项目信息
      if (command.name && command.name !== project.name) {
        const isNameUnique = await this.projectRepository.isNameUniqueForUser(
          command.userId,
          command.name,
          command.projectId
        )
        if (!isNameUnique) {
          return { success: false, error: '项目名称已存在' }
        }
        project.updateName(command.name)
      }

      if (command.description !== undefined) {
        project.updateDescription(command.description)
      }

      if (command.config) {
        project.updateConfig(command.config)
      }

      // 保存更新
      await this.projectRepository.save(project)

      // 分发领域事件
      await this.eventDispatcher.dispatchEvents(project.domainEvents)
      project.clearDomainEvents()

      return { success: true }
    } catch (error) {
      if (error instanceof DomainError) {
        return { success: false, error: error.message }
      }
      throw error
    }
  }

  /**
   * 发布项目
   */
  async publishProject(command: PublishProjectCommand): Promise<ApplicationResult> {
    try {
      const project = await this.projectRepository.findById(command.projectId)
      if (!project) {
        return { success: false, error: '项目不存在' }
      }

      // 权限检查
      if (project.userId !== command.userId) {
        return { success: false, error: '无权限操作此项目' }
      }

      // 发布项目
      project.publish()

      // 保存更新
      await this.projectRepository.save(project)

      // 分发领域事件
      await this.eventDispatcher.dispatchEvents(project.domainEvents)
      project.clearDomainEvents()

      return { success: true }
    } catch (error) {
      if (error instanceof DomainError) {
        return { success: false, error: error.message }
      }
      throw error
    }
  }

  /**
   * 删除项目
   */
  async deleteProject(command: DeleteProjectCommand): Promise<ApplicationResult> {
    try {
      const project = await this.projectRepository.findById(command.projectId)
      if (!project) {
        return { success: false, error: '项目不存在' }
      }

      // 权限检查
      if (project.userId !== command.userId) {
        return { success: false, error: '无权限操作此项目' }
      }

      // 删除项目
      await this.projectRepository.delete(command.projectId)

      return { success: true }
    } catch (error) {
      if (error instanceof DomainError) {
        return { success: false, error: error.message }
      }
      throw error
    }
  }

  /**
   * 查询项目详情
   */
  async getProject(query: GetProjectQuery): Promise<ApplicationResult<Project>> {
    try {
      const project = await this.projectRepository.findById(query.projectId)
      if (!project) {
        return { success: false, error: '项目不存在' }
      }

      // 权限检查
      if (project.userId !== query.userId) {
        return { success: false, error: '无权限访问此项目' }
      }

      return {
        success: true,
        data: project,
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * 查询用户项目列表
   */
  async getUserProjects(query: GetUserProjectsQuery): Promise<
    ApplicationResult<{
      projects: Project[]
      total: number
      page: number
      limit: number
      totalPages: number
    }>
  > {
    try {
      const page = query.page || 1
      const limit = query.limit || 10

      const result = await this.projectRepository.findByUserIdWithPagination(
        query.userId,
        page,
        limit,
        query.search
      )

      // 如果指定了状态，进行过滤
      if (query.status) {
        result.projects = result.projects.filter(p => p.status === query.status)
        result.total = result.projects.length
        result.totalPages = Math.ceil(result.total / limit)
      }

      return {
        success: true,
        data: result,
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * 查询项目统计信息
   */
  async getProjectStats(query: GetProjectStatsQuery): Promise<
    ApplicationResult<{
      total: number
      published: number
      draft: number
      archived: number
    }>
  > {
    try {
      const stats = await this.projectRepository.getProjectStats(query.userId)
      return {
        success: true,
        data: stats,
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * 查询最近更新的项目
   */
  async getRecentProjects(query: GetRecentProjectsQuery): Promise<ApplicationResult<Project[]>> {
    try {
      const projects = await this.projectRepository.findRecentlyUpdated(query.userId, query.limit)

      return {
        success: true,
        data: projects,
      }
    } catch (error) {
      throw error
    }
  }
}
