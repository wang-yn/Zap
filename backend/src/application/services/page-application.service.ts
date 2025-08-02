import { Injectable, Inject } from '@nestjs/common'
import { PageRepository } from '../../domain/repositories/page.repository'
import { ProjectRepository } from '../../domain/repositories/project.repository'
import { DomainEventDispatcher } from '../../domain/events/domain-event'
import {
  PAGE_REPOSITORY,
  PROJECT_REPOSITORY,
  DOMAIN_EVENT_DISPATCHER,
} from '../../common/constants/injection-tokens'
import { Page } from '../../domain/entities/page.entity'
import { DomainError } from '../../domain/errors/domain-error'
import {
  CreatePageCommand,
  UpdatePageCommand,
  PublishPageCommand,
  UnpublishPageCommand,
  AddComponentCommand,
  UpdateComponentCommand,
  RemoveComponentCommand,
  ReorderComponentsCommand,
} from '../commands/page.commands'
import { GetPageQuery, GetProjectPagesQuery, PreviewPageQuery } from '../queries/page.queries'

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
export class PageApplicationService {
  constructor(
    @Inject(PAGE_REPOSITORY) private readonly pageRepository: PageRepository,
    @Inject(PROJECT_REPOSITORY) private readonly projectRepository: ProjectRepository,
    @Inject(DOMAIN_EVENT_DISPATCHER) private readonly eventDispatcher: DomainEventDispatcher
  ) {}

  /**
   * 验证用户对项目的权限
   */
  private async validateProjectAccess(projectId: string, userId: string): Promise<boolean> {
    const project = await this.projectRepository.findById(projectId)
    return project?.userId === userId
  }

  /**
   * 创建页面
   */
  async createPage(command: CreatePageCommand): Promise<ApplicationResult<{ pageId: string }>> {
    try {
      // 验证项目权限
      const hasAccess = await this.validateProjectAccess(command.projectId, command.userId)
      if (!hasAccess) {
        return { success: false, error: '无权限访问此项目' }
      }

      // 检查路径是否唯一
      const isPathUnique = await this.pageRepository.isPathUniqueInProject(
        command.projectId,
        command.path
      )
      if (!isPathUnique) {
        return { success: false, error: '页面路径已存在' }
      }

      // 检查名称是否唯一
      const isNameUnique = await this.pageRepository.isNameUniqueInProject(
        command.projectId,
        command.name
      )
      if (!isNameUnique) {
        return { success: false, error: '页面名称已存在' }
      }

      // 创建页面
      const page = Page.create({
        projectId: command.projectId,
        name: command.name,
        path: command.path,
        title: command.title,
      })

      // 设置布局
      if (command.layout) {
        page.updateLayout(command.layout)
      }

      // 保存页面
      await this.pageRepository.save(page)

      // 分发领域事件
      await this.eventDispatcher.dispatchEvents(page.domainEvents)
      page.clearDomainEvents()

      return {
        success: true,
        data: { pageId: page.id },
      }
    } catch (error) {
      if (error instanceof DomainError) {
        return { success: false, error: error.message }
      }
      throw error
    }
  }

  /**
   * 更新页面
   */
  async updatePage(command: UpdatePageCommand): Promise<ApplicationResult> {
    try {
      const page = await this.pageRepository.findById(command.pageId)
      if (!page) {
        return { success: false, error: '页面不存在' }
      }

      // 验证权限
      const hasAccess = await this.validateProjectAccess(page.projectId, command.userId)
      if (!hasAccess) {
        return { success: false, error: '无权限操作此页面' }
      }

      // 更新页面信息
      if (command.name && command.name !== page.name) {
        const isNameUnique = await this.pageRepository.isNameUniqueInProject(
          page.projectId,
          command.name,
          command.pageId
        )
        if (!isNameUnique) {
          return { success: false, error: '页面名称已存在' }
        }
        page.updateName(command.name)
      }

      if (command.path && command.path !== page.path) {
        const isPathUnique = await this.pageRepository.isPathUniqueInProject(
          page.projectId,
          command.path,
          command.pageId
        )
        if (!isPathUnique) {
          return { success: false, error: '页面路径已存在' }
        }
        page.updatePath(command.path)
      }

      if (command.title !== undefined) {
        page.updateTitle(command.title)
      }

      if (command.layout) {
        page.updateLayout(command.layout)
      }

      // 保存更新
      await this.pageRepository.save(page)

      // 分发领域事件
      await this.eventDispatcher.dispatchEvents(page.domainEvents)
      page.clearDomainEvents()

      return { success: true }
    } catch (error) {
      if (error instanceof DomainError) {
        return { success: false, error: error.message }
      }
      throw error
    }
  }

  /**
   * 发布页面
   */
  async publishPage(command: PublishPageCommand): Promise<ApplicationResult> {
    try {
      const page = await this.pageRepository.findById(command.pageId)
      if (!page) {
        return { success: false, error: '页面不存在' }
      }

      // 验证权限
      const hasAccess = await this.validateProjectAccess(page.projectId, command.userId)
      if (!hasAccess) {
        return { success: false, error: '无权限操作此页面' }
      }

      // 发布页面
      page.publish()

      // 保存更新
      await this.pageRepository.save(page)

      // 分发领域事件
      await this.eventDispatcher.dispatchEvents(page.domainEvents)
      page.clearDomainEvents()

      return { success: true }
    } catch (error) {
      if (error instanceof DomainError) {
        return { success: false, error: error.message }
      }
      throw error
    }
  }

  /**
   * 取消发布页面
   */
  async unpublishPage(command: UnpublishPageCommand): Promise<ApplicationResult> {
    try {
      const page = await this.pageRepository.findById(command.pageId)
      if (!page) {
        return { success: false, error: '页面不存在' }
      }

      // 验证权限
      const hasAccess = await this.validateProjectAccess(page.projectId, command.userId)
      if (!hasAccess) {
        return { success: false, error: '无权限操作此页面' }
      }

      // 取消发布
      page.unpublish()

      // 保存更新
      await this.pageRepository.save(page)

      // 分发领域事件
      await this.eventDispatcher.dispatchEvents(page.domainEvents)
      page.clearDomainEvents()

      return { success: true }
    } catch (error) {
      if (error instanceof DomainError) {
        return { success: false, error: error.message }
      }
      throw error
    }
  }

  /**
   * 添加组件
   */
  async addComponent(
    command: AddComponentCommand
  ): Promise<ApplicationResult<{ componentId: string }>> {
    try {
      const page = await this.pageRepository.findById(command.pageId)
      if (!page) {
        return { success: false, error: '页面不存在' }
      }

      // 验证权限
      const hasAccess = await this.validateProjectAccess(page.projectId, command.userId)
      if (!hasAccess) {
        return { success: false, error: '无权限操作此页面' }
      }

      // 添加组件
      const component = page.addComponent(command.componentType, command.props, command.position)

      // 保存更新
      await this.pageRepository.save(page)

      // 分发领域事件
      await this.eventDispatcher.dispatchEvents(page.domainEvents)
      page.clearDomainEvents()

      return {
        success: true,
        data: { componentId: component.id },
      }
    } catch (error) {
      if (error instanceof DomainError) {
        return { success: false, error: error.message }
      }
      throw error
    }
  }

  /**
   * 更新组件
   */
  async updateComponent(command: UpdateComponentCommand): Promise<ApplicationResult> {
    try {
      const page = await this.pageRepository.findById(command.pageId)
      if (!page) {
        return { success: false, error: '页面不存在' }
      }

      // 验证权限
      const hasAccess = await this.validateProjectAccess(page.projectId, command.userId)
      if (!hasAccess) {
        return { success: false, error: '无权限操作此页面' }
      }

      // 更新组件
      page.updateComponent(command.componentId, command.props)

      // 保存更新
      await this.pageRepository.save(page)

      // 分发领域事件
      await this.eventDispatcher.dispatchEvents(page.domainEvents)
      page.clearDomainEvents()

      return { success: true }
    } catch (error) {
      if (error instanceof DomainError) {
        return { success: false, error: error.message }
      }
      throw error
    }
  }

  /**
   * 删除组件
   */
  async removeComponent(command: RemoveComponentCommand): Promise<ApplicationResult> {
    try {
      const page = await this.pageRepository.findById(command.pageId)
      if (!page) {
        return { success: false, error: '页面不存在' }
      }

      // 验证权限
      const hasAccess = await this.validateProjectAccess(page.projectId, command.userId)
      if (!hasAccess) {
        return { success: false, error: '无权限操作此页面' }
      }

      // 删除组件
      page.removeComponent(command.componentId)

      // 保存更新
      await this.pageRepository.save(page)

      // 分发领域事件
      await this.eventDispatcher.dispatchEvents(page.domainEvents)
      page.clearDomainEvents()

      return { success: true }
    } catch (error) {
      if (error instanceof DomainError) {
        return { success: false, error: error.message }
      }
      throw error
    }
  }

  /**
   * 重新排序组件
   */
  async reorderComponents(command: ReorderComponentsCommand): Promise<ApplicationResult> {
    try {
      const page = await this.pageRepository.findById(command.pageId)
      if (!page) {
        return { success: false, error: '页面不存在' }
      }

      // 验证权限
      const hasAccess = await this.validateProjectAccess(page.projectId, command.userId)
      if (!hasAccess) {
        return { success: false, error: '无权限操作此页面' }
      }

      // 重新排序
      page.reorderComponents(command.componentIds)

      // 保存更新
      await this.pageRepository.save(page)

      // 分发领域事件
      await this.eventDispatcher.dispatchEvents(page.domainEvents)
      page.clearDomainEvents()

      return { success: true }
    } catch (error) {
      if (error instanceof DomainError) {
        return { success: false, error: error.message }
      }
      throw error
    }
  }

  /**
   * 查询页面详情
   */
  async getPage(query: GetPageQuery): Promise<ApplicationResult<Page>> {
    try {
      const page = await this.pageRepository.findById(query.pageId)
      if (!page) {
        return { success: false, error: '页面不存在' }
      }

      // 验证权限
      const hasAccess = await this.validateProjectAccess(page.projectId, query.userId)
      if (!hasAccess) {
        return { success: false, error: '无权限访问此页面' }
      }

      return {
        success: true,
        data: page,
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * 查询项目页面列表
   */
  async getProjectPages(query: GetProjectPagesQuery): Promise<
    ApplicationResult<{
      pages: Page[]
      total: number
      page: number
      limit: number
      totalPages: number
    }>
  > {
    try {
      // 验证权限
      const hasAccess = await this.validateProjectAccess(query.projectId, query.userId)
      if (!hasAccess) {
        return { success: false, error: '无权限访问此项目' }
      }

      const page = query.page || 1
      const limit = query.limit || 10

      const result = await this.pageRepository.findByProjectIdWithPagination(
        query.projectId,
        page,
        limit,
        query.search
      )

      // 如果不包含未发布页面，进行过滤
      if (!query.includeUnpublished) {
        result.pages = result.pages.filter(p => p.isPublished)
        result.total = result.pages.length
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
   * 预览页面
   */
  async previewPage(query: PreviewPageQuery): Promise<
    ApplicationResult<{
      page: Page
      renderData: any
    }>
  > {
    try {
      const page = await this.pageRepository.findById(query.pageId)
      if (!page) {
        return { success: false, error: '页面不存在' }
      }

      // 验证权限
      const hasAccess = await this.validateProjectAccess(page.projectId, query.userId)
      if (!hasAccess) {
        return { success: false, error: '无权限访问此页面' }
      }

      // 生成渲染数据
      const renderData = {
        meta: {
          title: page.title || page.name,
          path: page.path,
        },
        layout: page.layout.toJSON(),
        components: page.components.map(component => component.getRenderConfig()),
      }

      return {
        success: true,
        data: {
          page,
          renderData,
        },
      }
    } catch (error) {
      throw error
    }
  }
}
