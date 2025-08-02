import { DomainEvent } from '../events/domain-event'
import { ProjectConfig } from '../value-objects/project-config.vo'
import { Page } from './page.entity'
import {
  ProjectCreatedEvent,
  ProjectNameChangedEvent,
  ProjectPublishedEvent,
  PageAddedToProjectEvent,
} from '../events/project.events'
import { DomainError } from '../errors/domain-error'
import { generateId } from '../../common/utils/id-generator'
import { ProjectStatus as PrismaProjectStatus } from '@prisma/client'

export { PrismaProjectStatus as ProjectStatus }

export class Project {
  private _domainEvents: DomainEvent[] = []

  private constructor(
    private readonly _id: string,
    private _name: string,
    private _description: string | null,
    private readonly _userId: string,
    private _status: PrismaProjectStatus,
    private _config: ProjectConfig,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _pages: Page[] = []
  ) {}

  // 工厂方法
  static create(data: {
    name: string
    description?: string
    userId: string
    config?: ProjectConfig
  }): Project {
    const project = new Project(
      generateId(),
      data.name,
      data.description || null,
      data.userId,
      PrismaProjectStatus.DRAFT,
      data.config || ProjectConfig.default(),
      new Date(),
      new Date()
    )

    // 触发领域事件
    project.addDomainEvent(new ProjectCreatedEvent(project.id, data.userId))
    return project
  }

  // 从持久化数据重建实体
  static fromPersistence(data: {
    id: string
    name: string
    description: string | null
    userId: string
    status: PrismaProjectStatus
    config: any
    createdAt: Date
    updatedAt: Date
    pages?: Page[]
  }): Project {
    return new Project(
      data.id,
      data.name,
      data.description,
      data.userId,
      data.status,
      ProjectConfig.fromJSON(data.config),
      data.createdAt,
      data.updatedAt,
      data.pages || []
    )
  }

  // 业务方法
  updateName(name: string): void {
    this.validateName(name)
    const oldName = this._name
    this._name = name
    this._updatedAt = new Date()

    this.addDomainEvent(new ProjectNameChangedEvent(this.id, oldName, name))
  }

  updateDescription(description: string | null): void {
    this._description = description
    this._updatedAt = new Date()
  }

  updateConfig(config: ProjectConfig): void {
    this._config = config
    this._updatedAt = new Date()
  }

  addPage(pageData: { name: string; path: string; title?: string }): Page {
    this.validatePagePath(pageData.path)

    const page = Page.create({
      ...pageData,
      projectId: this.id,
    })

    this._pages.push(page)
    this._updatedAt = new Date()

    this.addDomainEvent(new PageAddedToProjectEvent(this.id, page.id))
    return page
  }

  removePage(pageId: string): void {
    const pageIndex = this._pages.findIndex(p => p.id === pageId)
    if (pageIndex === -1) {
      throw new DomainError(`页面 ${pageId} 不存在`)
    }

    this._pages.splice(pageIndex, 1)
    this._updatedAt = new Date()
  }

  publish(): void {
    this.validateCanPublish()
    this._status = PrismaProjectStatus.PUBLISHED
    this._updatedAt = new Date()

    this.addDomainEvent(new ProjectPublishedEvent(this.id, this._userId))
  }

  archive(): void {
    this._status = PrismaProjectStatus.ARCHIVED
    this._updatedAt = new Date()
  }

  // 业务规则验证
  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new DomainError('项目名称不能为空')
    }
    if (name.length > 100) {
      throw new DomainError('项目名称长度不能超过100个字符')
    }
  }

  private validatePagePath(path: string): void {
    const existingPaths = this._pages.map(p => p.path)
    if (existingPaths.includes(path)) {
      throw new DomainError(`路径 ${path} 已存在`)
    }
  }

  private validateCanPublish(): void {
    if (this._pages.length === 0) {
      throw new DomainError('项目至少需要一个页面才能发布')
    }
    if (!this._pages.some(p => p.isPublished)) {
      throw new DomainError('项目至少需要一个已发布的页面')
    }
  }

  // Getters
  get id(): string {
    return this._id
  }
  get name(): string {
    return this._name
  }
  get description(): string | null {
    return this._description
  }
  get userId(): string {
    return this._userId
  }
  get status(): PrismaProjectStatus {
    return this._status
  }
  get config(): ProjectConfig {
    return this._config
  }
  get pages(): readonly Page[] {
    return this._pages
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
      name: this._name,
      description: this._description,
      userId: this._userId,
      status: this._status,
      config: this._config.toJSON(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    }
  }
}
