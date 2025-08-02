import { DomainEvent } from '../events/domain-event'
import { PageLayout } from '../value-objects/page-layout.vo'
import { Component } from './component.entity'
import {
  PageCreatedEvent,
  PagePublishedEvent,
  PageUnpublishedEvent,
  ComponentAddedEvent,
  ComponentRemovedEvent,
  ComponentUpdatedEvent,
  ComponentsReorderedEvent,
} from '../events/page.events'
import { DomainError } from '../errors/domain-error'
import { ComponentType } from '../types/component.types'
import { generateId } from '../../common/utils/id-generator'

export class Page {
  private _domainEvents: DomainEvent[] = []

  private constructor(
    private readonly _id: string,
    private readonly _projectId: string,
    private _name: string,
    private _path: string,
    private _title: string | null,
    private _components: Component[],
    private _layout: PageLayout,
    private _isPublished: boolean,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  // 工厂方法
  static create(data: { name: string; path: string; title?: string; projectId: string }): Page {
    const page = new Page(
      generateId(),
      data.projectId,
      data.name,
      data.path,
      data.title || null,
      [],
      PageLayout.default(),
      false,
      new Date(),
      new Date()
    )

    page.addDomainEvent(new PageCreatedEvent(page.id, data.projectId))
    return page
  }

  // 从持久化数据重建实体
  static fromPersistence(data: {
    id: string
    projectId: string
    name: string
    path: string
    title: string | null
    components: any[]
    layout: any
    isPublished: boolean
    createdAt: Date
    updatedAt: Date
  }): Page {
    const components = data.components.map(c => Component.fromPersistence(c))

    return new Page(
      data.id,
      data.projectId,
      data.name,
      data.path,
      data.title,
      components,
      PageLayout.fromJSON(data.layout),
      data.isPublished,
      data.createdAt,
      data.updatedAt
    )
  }

  // 基本信息更新
  updateName(name: string): void {
    this.validateName(name)
    this._name = name
    this._updatedAt = new Date()
  }

  updatePath(path: string): void {
    this.validatePath(path)
    this._path = path
    this._updatedAt = new Date()
  }

  updateTitle(title: string | null): void {
    this._title = title
    this._updatedAt = new Date()
  }

  updateLayout(layout: PageLayout): void {
    this._layout = layout
    this._updatedAt = new Date()
  }

  // 组件管理
  addComponent(
    componentType: ComponentType,
    props: Record<string, any>,
    position?: number
  ): Component {
    const component = Component.create(componentType, props)

    if (position !== undefined && position >= 0 && position <= this._components.length) {
      this._components.splice(position, 0, component)
    } else {
      this._components.push(component)
    }

    this._updatedAt = new Date()
    this.addDomainEvent(new ComponentAddedEvent(this.id, component.id, componentType))

    return component
  }

  removeComponent(componentId: string): void {
    const index = this._components.findIndex(c => c.id === componentId)
    if (index === -1) {
      throw new DomainError(`组件 ${componentId} 不存在`)
    }

    const component = this._components[index]
    this._components.splice(index, 1)
    this._updatedAt = new Date()

    this.addDomainEvent(new ComponentRemovedEvent(this.id, componentId, component.type))
  }

  updateComponent(componentId: string, props: Record<string, any>): void {
    const component = this.findComponent(componentId)
    if (!component) {
      throw new DomainError(`组件 ${componentId} 不存在`)
    }

    component.updateProps(props)
    this._updatedAt = new Date()

    this.addDomainEvent(new ComponentUpdatedEvent(this.id, componentId))
  }

  reorderComponents(componentIds: string[]): void {
    this.validateComponentOrder(componentIds)

    const reorderedComponents = componentIds.map(id => this._components.find(c => c.id === id)!)

    this._components = reorderedComponents
    this._updatedAt = new Date()

    this.addDomainEvent(new ComponentsReorderedEvent(this.id, componentIds))
  }

  // 发布管理
  publish(): void {
    this.validateCanPublish()
    this._isPublished = true
    this._updatedAt = new Date()

    this.addDomainEvent(new PagePublishedEvent(this.id, this._projectId))
  }

  unpublish(): void {
    this._isPublished = false
    this._updatedAt = new Date()

    this.addDomainEvent(new PageUnpublishedEvent(this.id, this._projectId))
  }

  // 业务规则验证
  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new DomainError('页面名称不能为空')
    }
    if (name.length > 100) {
      throw new DomainError('页面名称长度不能超过100个字符')
    }
  }

  private validatePath(path: string): void {
    if (!path || path.trim().length === 0) {
      throw new DomainError('页面路径不能为空')
    }
    if (!path.startsWith('/')) {
      throw new DomainError('页面路径必须以 / 开头')
    }
    if (path.length > 200) {
      throw new DomainError('页面路径长度不能超过200个字符')
    }
  }

  private validateCanPublish(): void {
    if (this._components.length === 0) {
      throw new DomainError('页面至少需要一个组件才能发布')
    }
  }

  private findComponent(componentId: string): Component | undefined {
    return this._components.find(c => c.id === componentId)
  }

  private validateComponentOrder(componentIds: string[]): void {
    if (componentIds.length !== this._components.length) {
      throw new DomainError('组件顺序不完整')
    }

    const currentIds = this._components.map(c => c.id)
    const missingIds = currentIds.filter(id => !componentIds.includes(id))

    if (missingIds.length > 0) {
      throw new DomainError(`缺少组件: ${missingIds.join(', ')}`)
    }
  }

  // Getters
  get id(): string {
    return this._id
  }
  get projectId(): string {
    return this._projectId
  }
  get name(): string {
    return this._name
  }
  get path(): string {
    return this._path
  }
  get title(): string | null {
    return this._title
  }
  get components(): readonly Component[] {
    return this._components
  }
  get layout(): PageLayout {
    return this._layout
  }
  get isPublished(): boolean {
    return this._isPublished
  }
  get createdAt(): Date {
    return this._createdAt
  }
  get updatedAt(): Date {
    return this._updatedAt
  }

  // 领域事件支持
  addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event)
  }

  clearDomainEvents(): void {
    this._domainEvents = []
  }

  get domainEvents(): readonly DomainEvent[] {
    return this._domainEvents
  }

  // 持久化数据转换
  toPersistence() {
    return {
      id: this._id,
      projectId: this._projectId,
      name: this._name,
      path: this._path,
      title: this._title,
      components: this._components.map(c => c.toPersistence()),
      layout: this._layout.toJSON(),
      isPublished: this._isPublished,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    }
  }
}
