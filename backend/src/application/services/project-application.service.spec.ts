import { Test, TestingModule } from '@nestjs/testing'
import { ProjectApplicationService, ApplicationResult } from './project-application.service'
import { ProjectRepository } from '../../domain/repositories/project.repository'
import { UserRepository } from '../../domain/repositories/user.repository'
import { DomainEventDispatcher } from '../../domain/events/domain-event'
import { Project, ProjectStatus } from '../../domain/entities/project.entity'
import { User } from '../../domain/entities/user.entity'
import { DomainError } from '../../domain/errors/domain-error'
import { ProjectConfig } from '../../domain/value-objects/project-config.vo'
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

describe('ProjectApplicationService', () => {
  let service: ProjectApplicationService
  let projectRepository: jest.Mocked<ProjectRepository>
  let userRepository: jest.Mocked<UserRepository>
  let eventDispatcher: jest.Mocked<DomainEventDispatcher>

  const mockUser = User.fromPersistence({
    id: 'user-123',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedpassword',
    avatar: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  const mockProject = Project.fromPersistence({
    id: 'project-123',
    name: 'Test Project',
    description: 'Test Description',
    userId: 'user-123',
    status: ProjectStatus.DRAFT,
    config: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  beforeEach(async () => {
    const mockProjectRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      isNameUniqueForUser: jest.fn(),
      findByUserIdWithPagination: jest.fn(),
      getProjectStats: jest.fn(),
      findRecentlyUpdated: jest.fn(),
    }

    const mockUserRepository = {
      findById: jest.fn(),
    }

    const mockEventDispatcher = {
      dispatchEvents: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectApplicationService,
        {
          provide: PROJECT_REPOSITORY,
          useValue: mockProjectRepository,
        },
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
        {
          provide: DOMAIN_EVENT_DISPATCHER,
          useValue: mockEventDispatcher,
        },
      ],
    }).compile()

    service = module.get<ProjectApplicationService>(ProjectApplicationService)
    projectRepository = module.get(PROJECT_REPOSITORY)
    userRepository = module.get(USER_REPOSITORY)
    eventDispatcher = module.get(DOMAIN_EVENT_DISPATCHER)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createProject', () => {
    const createCommand: CreateProjectCommand = {
      name: 'New Project',
      description: 'New Description',
      userId: 'user-123',
      config: ProjectConfig.default(),
    }

    it('should create project successfully', async () => {
      userRepository.findById.mockResolvedValue(mockUser)
      projectRepository.isNameUniqueForUser.mockResolvedValue(true)
      projectRepository.save.mockResolvedValue(undefined)
      eventDispatcher.dispatchEvents.mockResolvedValue(undefined)

      const result = await service.createProject(createCommand)

      expect(result.success).toBe(true)
      expect(result.data?.projectId).toBeDefined()
      expect(userRepository.findById).toHaveBeenCalledWith('user-123')
      expect(projectRepository.isNameUniqueForUser).toHaveBeenCalledWith('user-123', 'New Project')
      expect(projectRepository.save).toHaveBeenCalled()
      expect(eventDispatcher.dispatchEvents).toHaveBeenCalled()
    })

    it('should return error when user does not exist', async () => {
      userRepository.findById.mockResolvedValue(null)

      const result = await service.createProject(createCommand)

      expect(result.success).toBe(false)
      expect(result.error).toBe('用户不存在')
      expect(projectRepository.save).not.toHaveBeenCalled()
    })

    it('should return error when project name is not unique', async () => {
      userRepository.findById.mockResolvedValue(mockUser)
      projectRepository.isNameUniqueForUser.mockResolvedValue(false)

      const result = await service.createProject(createCommand)

      expect(result.success).toBe(false)
      expect(result.error).toBe('项目名称已存在')
      expect(projectRepository.save).not.toHaveBeenCalled()
    })
  })

  describe('getProject', () => {
    const getQuery: GetProjectQuery = {
      projectId: 'project-123',
      userId: 'user-123',
    }

    it('should get project successfully', async () => {
      projectRepository.findById.mockResolvedValue(mockProject)

      const result = await service.getProject(getQuery)

      expect(result.success).toBe(true)
      expect(result.data).toBe(mockProject)
    })

    it('should return error when project does not exist', async () => {
      projectRepository.findById.mockResolvedValue(null)

      const result = await service.getProject(getQuery)

      expect(result.success).toBe(false)
      expect(result.error).toBe('项目不存在')
    })
  })

  describe('deleteProject', () => {
    const deleteCommand: DeleteProjectCommand = {
      projectId: 'project-123',
      userId: 'user-123',
    }

    it('should delete project successfully', async () => {
      projectRepository.findById.mockResolvedValue(mockProject)
      projectRepository.delete.mockResolvedValue(undefined)

      const result = await service.deleteProject(deleteCommand)

      expect(result.success).toBe(true)
      expect(projectRepository.delete).toHaveBeenCalledWith('project-123')
    })

    it('should return error when project does not exist', async () => {
      projectRepository.findById.mockResolvedValue(null)

      const result = await service.deleteProject(deleteCommand)

      expect(result.success).toBe(false)
      expect(result.error).toBe('项目不存在')
      expect(projectRepository.delete).not.toHaveBeenCalled()
    })
  })
})