import { DomainEvent } from './domain-event';
import { ProjectStatus } from '../entities/project.entity';

/**
 * 项目创建事件
 */
export class ProjectCreatedEvent extends DomainEvent {
  constructor(
    projectId: string,
    public readonly userId: string,
    public readonly projectName?: string
  ) {
    super(projectId, 'ProjectCreated');
  }

  getEventData(): Record<string, any> {
    return {
      userId: this.userId,
      projectName: this.projectName
    };
  }
}

/**
 * 项目名称变更事件
 */
export class ProjectNameChangedEvent extends DomainEvent {
  constructor(
    projectId: string,
    public readonly oldName: string,
    public readonly newName: string
  ) {
    super(projectId, 'ProjectNameChanged');
  }

  getEventData(): Record<string, any> {
    return {
      oldName: this.oldName,
      newName: this.newName
    };
  }
}

/**
 * 项目发布事件
 */
export class ProjectPublishedEvent extends DomainEvent {
  constructor(
    projectId: string,
    public readonly userId: string
  ) {
    super(projectId, 'ProjectPublished');
  }

  getEventData(): Record<string, any> {
    return {
      userId: this.userId
    };
  }
}

/**
 * 项目状态变更事件
 */
export class ProjectStatusChangedEvent extends DomainEvent {
  constructor(
    projectId: string,
    public readonly oldStatus: ProjectStatus,
    public readonly newStatus: ProjectStatus,
    public readonly userId: string
  ) {
    super(projectId, 'ProjectStatusChanged');
  }

  getEventData(): Record<string, any> {
    return {
      oldStatus: this.oldStatus,
      newStatus: this.newStatus,
      userId: this.userId
    };
  }
}

/**
 * 页面添加到项目事件
 */
export class PageAddedToProjectEvent extends DomainEvent {
  constructor(
    projectId: string,
    public readonly pageId: string
  ) {
    super(projectId, 'PageAddedToProject');
  }

  getEventData(): Record<string, any> {
    return {
      pageId: this.pageId
    };
  }
}

/**
 * 页面从项目移除事件
 */
export class PageRemovedFromProjectEvent extends DomainEvent {
  constructor(
    projectId: string,
    public readonly pageId: string
  ) {
    super(projectId, 'PageRemovedFromProject');
  }

  getEventData(): Record<string, any> {
    return {
      pageId: this.pageId
    };
  }
}

/**
 * 项目配置更新事件
 */
export class ProjectConfigUpdatedEvent extends DomainEvent {
  constructor(
    projectId: string,
    public readonly configType: 'theme' | 'navigation' | 'all',
    public readonly userId: string
  ) {
    super(projectId, 'ProjectConfigUpdated');
  }

  getEventData(): Record<string, any> {
    return {
      configType: this.configType,
      userId: this.userId
    };
  }
}

/**
 * 项目删除事件
 */
export class ProjectDeletedEvent extends DomainEvent {
  constructor(
    projectId: string,
    public readonly userId: string,
    public readonly projectName: string
  ) {
    super(projectId, 'ProjectDeleted');
  }

  getEventData(): Record<string, any> {
    return {
      userId: this.userId,
      projectName: this.projectName
    };
  }
}