import { DomainEvent } from './domain-event'
import { ComponentType } from '../types/component.types'

/**
 * 页面创建事件
 */
export class PageCreatedEvent extends DomainEvent {
  constructor(
    pageId: string,
    public readonly projectId: string,
    public readonly pageName?: string,
    public readonly pagePath?: string
  ) {
    super(pageId, 'PageCreated')
  }

  getEventData(): Record<string, any> {
    return {
      projectId: this.projectId,
      pageName: this.pageName,
      pagePath: this.pagePath,
    }
  }
}

/**
 * 页面发布事件
 */
export class PagePublishedEvent extends DomainEvent {
  constructor(
    pageId: string,
    public readonly projectId: string
  ) {
    super(pageId, 'PagePublished')
  }

  getEventData(): Record<string, any> {
    return {
      projectId: this.projectId,
    }
  }
}

/**
 * 页面取消发布事件
 */
export class PageUnpublishedEvent extends DomainEvent {
  constructor(
    pageId: string,
    public readonly projectId: string
  ) {
    super(pageId, 'PageUnpublished')
  }

  getEventData(): Record<string, any> {
    return {
      projectId: this.projectId,
    }
  }
}

/**
 * 组件添加事件
 */
export class ComponentAddedEvent extends DomainEvent {
  constructor(
    pageId: string,
    public readonly componentId: string,
    public readonly componentType: ComponentType,
    public readonly position?: number
  ) {
    super(pageId, 'ComponentAdded')
  }

  getEventData(): Record<string, any> {
    return {
      componentId: this.componentId,
      componentType: this.componentType,
      position: this.position,
    }
  }
}

/**
 * 组件移除事件
 */
export class ComponentRemovedEvent extends DomainEvent {
  constructor(
    pageId: string,
    public readonly componentId: string,
    public readonly componentType: ComponentType
  ) {
    super(pageId, 'ComponentRemoved')
  }

  getEventData(): Record<string, any> {
    return {
      componentId: this.componentId,
      componentType: this.componentType,
    }
  }
}

/**
 * 组件更新事件
 */
export class ComponentUpdatedEvent extends DomainEvent {
  constructor(
    pageId: string,
    public readonly componentId: string,
    public readonly updatedProperties?: string[]
  ) {
    super(pageId, 'ComponentUpdated')
  }

  getEventData(): Record<string, any> {
    return {
      componentId: this.componentId,
      updatedProperties: this.updatedProperties,
    }
  }
}

/**
 * 组件重新排序事件
 */
export class ComponentsReorderedEvent extends DomainEvent {
  constructor(
    pageId: string,
    public readonly newOrder: string[]
  ) {
    super(pageId, 'ComponentsReordered')
  }

  getEventData(): Record<string, any> {
    return {
      newOrder: this.newOrder,
    }
  }
}

/**
 * 页面名称变更事件
 */
export class PageNameChangedEvent extends DomainEvent {
  constructor(
    pageId: string,
    public readonly oldName: string,
    public readonly newName: string,
    public readonly projectId: string
  ) {
    super(pageId, 'PageNameChanged')
  }

  getEventData(): Record<string, any> {
    return {
      oldName: this.oldName,
      newName: this.newName,
      projectId: this.projectId,
    }
  }
}

/**
 * 页面路径变更事件
 */
export class PagePathChangedEvent extends DomainEvent {
  constructor(
    pageId: string,
    public readonly oldPath: string,
    public readonly newPath: string,
    public readonly projectId: string
  ) {
    super(pageId, 'PagePathChanged')
  }

  getEventData(): Record<string, any> {
    return {
      oldPath: this.oldPath,
      newPath: this.newPath,
      projectId: this.projectId,
    }
  }
}

/**
 * 页面布局更新事件
 */
export class PageLayoutUpdatedEvent extends DomainEvent {
  constructor(
    pageId: string,
    public readonly projectId: string
  ) {
    super(pageId, 'PageLayoutUpdated')
  }

  getEventData(): Record<string, any> {
    return {
      projectId: this.projectId,
    }
  }
}

/**
 * 页面删除事件
 */
export class PageDeletedEvent extends DomainEvent {
  constructor(
    pageId: string,
    public readonly projectId: string,
    public readonly pageName: string
  ) {
    super(pageId, 'PageDeleted')
  }

  getEventData(): Record<string, any> {
    return {
      projectId: this.projectId,
      pageName: this.pageName,
    }
  }
}
