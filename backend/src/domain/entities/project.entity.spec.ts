import { Project, ProjectStatus } from './project.entity'
import { ProjectConfig } from '../value-objects/project-config.vo'
import { DomainError } from '../errors/domain-error'
import { 
  ProjectCreatedEvent, 
  ProjectNameChangedEvent, 
  ProjectPublishedEvent,
  PageAddedToProjectEvent 
} from '../events/project.events'

describe('Project Entity', () => {
  describe('create', () => {
    it('should create a project with valid data', () => {
      const projectData = {
        name: 'Test Project',
        description: 'Test Description',
        userId: 'user-123',
      }

      const project = Project.create(projectData)

      expect(project.name).toBe(projectData.name)
      expect(project.description).toBe(projectData.description)
      expect(project.userId).toBe(projectData.userId)
      expect(project.status).toBe(ProjectStatus.DRAFT)
      expect(project.id).toBeDefined()
      expect(project.createdAt).toBeInstanceOf(Date)
      expect(project.updatedAt).toBeInstanceOf(Date)
    })

    it('should create project with default config when not provided', () => {
      const project = Project.create({
        name: 'Test Project',
        userId: 'user-123',
      })

      expect(project.config).toBeInstanceOf(ProjectConfig)
    })

    it('should emit ProjectCreatedEvent when created', () => {
      const project = Project.create({
        name: 'Test Project',
        userId: 'user-123',
      })

      const events = project.domainEvents
      expect(events).toHaveLength(1)
      expect(events[0]).toBeInstanceOf(ProjectCreatedEvent)
      expect((events[0] as ProjectCreatedEvent).aggregateId).toBe(project.id)
    })
  })

  describe('updateName', () => {
    let project: Project

    beforeEach(() => {
      project = Project.create({
        name: 'Original Name',
        userId: 'user-123',
      })
      project.clearDomainEvents() // 清除创建时的事件
    })

    it('should update project name successfully', async () => {
      const newName = 'Updated Name'
      const oldUpdatedAt = project.updatedAt

      // Add a small delay to ensure time difference
      await new Promise(resolve => setTimeout(resolve, 1))
      
      project.updateName(newName)

      expect(project.name).toBe(newName)
      expect(project.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
    })

    it('should emit ProjectNameChangedEvent when name is updated', () => {
      const oldName = project.name
      const newName = 'Updated Name'

      project.updateName(newName)

      const events = project.domainEvents
      expect(events).toHaveLength(1)
      expect(events[0]).toBeInstanceOf(ProjectNameChangedEvent)
      
      const event = events[0] as ProjectNameChangedEvent
      expect(event.aggregateId).toBe(project.id)
      expect(event.oldName).toBe(oldName)
      expect(event.newName).toBe(newName)
    })

    it('should throw DomainError when name is empty', () => {
      expect(() => project.updateName('')).toThrow(DomainError)
      expect(() => project.updateName('   ')).toThrow(DomainError)
    })

    it('should throw DomainError when name is too long', () => {
      const longName = 'a'.repeat(101)
      expect(() => project.updateName(longName)).toThrow(DomainError)
    })
  })

  describe('addPage', () => {
    let project: Project

    beforeEach(() => {
      project = Project.create({
        name: 'Test Project',
        userId: 'user-123',
      })
      project.clearDomainEvents()
    })

    it('should add page successfully', () => {
      const pageData = {
        name: 'Home Page',
        path: '/home',
        title: 'Home',
      }

      const page = project.addPage(pageData)

      expect(page.name).toBe(pageData.name)
      expect(page.path).toBe(pageData.path)
      expect(project.pages).toHaveLength(1)
      expect(project.pages[0]).toBe(page)
    })

    it('should emit PageAddedToProjectEvent when page is added', () => {
      const page = project.addPage({
        name: 'Test Page',
        path: '/test',
      })

      const events = project.domainEvents
      expect(events).toHaveLength(1)
      expect(events[0]).toBeInstanceOf(PageAddedToProjectEvent)
      
      const event = events[0] as PageAddedToProjectEvent
      expect(event.aggregateId).toBe(project.id)
      expect(event.pageId).toBe(page.id)
    })

    it('should throw DomainError when adding page with duplicate path', () => {
      project.addPage({ name: 'Page 1', path: '/test' })

      expect(() => {
        project.addPage({ name: 'Page 2', path: '/test' })
      }).toThrow(DomainError)
    })
  })

  describe('publish', () => {
    let project: Project

    beforeEach(() => {
      project = Project.create({
        name: 'Test Project',
        userId: 'user-123',
      })
      project.clearDomainEvents()
    })

    it('should throw DomainError when project has no pages', () => {
      expect(() => project.publish()).toThrow(DomainError)
    })

    it('should throw DomainError when project has no published pages', () => {
      project.addPage({ name: 'Test Page', path: '/test' })
      
      expect(() => project.publish()).toThrow(DomainError)
    })

    it('should publish successfully when project has published pages', () => {
      const page = project.addPage({ name: 'Test Page', path: '/test' })
      // Add a component to the page so it can be published
      const mockComponent = { 
        id: 'comp-1', 
        type: 'text', 
        props: {}, 
        position: { x: 0, y: 0 },
        size: { width: 100, height: 50 }
      };
      // We need to mock the component addition since we can't access the Component entity easily
      // In a real test, you'd create a proper Component entity
      (page as any)._components = [mockComponent]
      page.publish() // This should now work
      project.clearDomainEvents()

      project.publish()

      expect(project.status).toBe(ProjectStatus.PUBLISHED)
    })

    it('should emit ProjectPublishedEvent when published', () => {
      const page = project.addPage({ name: 'Test Page', path: '/test' })
      // Add a component to the page so it can be published
      const mockComponent = { 
        id: 'comp-1', 
        type: 'text', 
        props: {}, 
        position: { x: 0, y: 0 },
        size: { width: 100, height: 50 }
      };
      (page as any)._components = [mockComponent]
      page.publish()
      project.clearDomainEvents()

      project.publish()

      const events = project.domainEvents
      expect(events).toHaveLength(1)
      expect(events[0]).toBeInstanceOf(ProjectPublishedEvent)
    })
  })

  describe('fromPersistence', () => {
    it('should reconstruct project from persistence data', () => {
      const persistenceData = {
        id: 'project-123',
        name: 'Persisted Project',
        description: 'Description',
        userId: 'user-123',
        status: ProjectStatus.PUBLISHED,
        config: { theme: 'dark' },
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      }

      const project = Project.fromPersistence(persistenceData)

      expect(project.id).toBe(persistenceData.id)
      expect(project.name).toBe(persistenceData.name)
      expect(project.description).toBe(persistenceData.description)
      expect(project.userId).toBe(persistenceData.userId)
      expect(project.status).toBe(persistenceData.status)
      expect(project.createdAt).toBe(persistenceData.createdAt)
      expect(project.updatedAt).toBe(persistenceData.updatedAt)
    })
  })
})