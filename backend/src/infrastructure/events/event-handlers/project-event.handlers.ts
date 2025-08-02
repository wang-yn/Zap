import { Injectable, Logger } from '@nestjs/common'
import { DomainEventHandler } from '../../../domain/events/domain-event'
import {
  ProjectCreatedEvent,
  ProjectPublishedEvent,
  ProjectNameChangedEvent,
} from '../../../domain/events/project.events'

/**
 * 项目创建事件处理器
 */
@Injectable()
export class ProjectCreatedEventHandler implements DomainEventHandler<ProjectCreatedEvent> {
  private readonly logger = new Logger(ProjectCreatedEventHandler.name)

  async handle(event: ProjectCreatedEvent): Promise<void> {
    this.logger.log(`Project created: ${event.aggregateId} by user: ${event.userId}`)

    // 这里可以添加项目创建后的业务逻辑：
    // - 发送欢迎邮件
    // - 创建默认页面
    // - 记录用户行为
    // - 更新统计数据等

    // 示例：记录项目创建日志
    this.logger.debug(`Project creation details:`, {
      projectId: event.aggregateId,
      userId: event.userId,
      projectName: event.projectName,
      occurredAt: event.occurredAt,
    })
  }
}

/**
 * 项目发布事件处理器
 */
@Injectable()
export class ProjectPublishedEventHandler implements DomainEventHandler<ProjectPublishedEvent> {
  private readonly logger = new Logger(ProjectPublishedEventHandler.name)

  async handle(event: ProjectPublishedEvent): Promise<void> {
    this.logger.log(`Project published: ${event.aggregateId} by user: ${event.userId}`)

    // 这里可以添加项目发布后的业务逻辑：
    // - 生成静态文件
    // - 部署到CDN
    // - 发送发布通知
    // - 更新搜索索引等

    // 示例：记录项目发布日志
    this.logger.debug(`Project publication details:`, {
      projectId: event.aggregateId,
      userId: event.userId,
      occurredAt: event.occurredAt,
    })
  }
}

/**
 * 项目名称变更事件处理器
 */
@Injectable()
export class ProjectNameChangedEventHandler implements DomainEventHandler<ProjectNameChangedEvent> {
  private readonly logger = new Logger(ProjectNameChangedEventHandler.name)

  async handle(event: ProjectNameChangedEvent): Promise<void> {
    this.logger.log(`Project name changed: ${event.aggregateId}`)

    // 这里可以添加项目名称变更后的业务逻辑：
    // - 更新相关缓存
    // - 同步到搜索引擎
    // - 记录变更历史等

    // 示例：记录项目名称变更日志
    this.logger.debug(`Project name change details:`, {
      projectId: event.aggregateId,
      oldName: event.oldName,
      newName: event.newName,
      occurredAt: event.occurredAt,
    })
  }
}
