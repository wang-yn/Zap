import { Test, TestingModule } from '@nestjs/testing'
import { HttpException, HttpStatus } from '@nestjs/common'
import { ProjectsController } from './projects.controller'
import { ProjectApplicationService } from '../../application/services/project-application.service'
import { CreateProjectDto, UpdateProjectDto, GetUserProjectsDto } from './dto/project.dto'
import { Project, ProjectStatus } from '../../domain/entities/project.entity'

describe('ProjectsController', () => {
  let controller: ProjectsController
  let projectApplicationService: jest.Mocked<ProjectApplicationService>

  const mockUser = { id: 'user-123', email: 'test@example.com' }
  const mockRequest = { user: mockUser }

  beforeEach(async () => {
    const mockProjectService = {
      createProject: jest.fn(),
      getUserProjects: jest.fn(),
      getProjectStats: jest.fn(),
      getRecentProjects: jest.fn(),
      getProject: jest.fn(),
      updateProject: jest.fn(),
      publishProject: jest.fn(),
      deleteProject: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectApplicationService,
          useValue: mockProjectService,
        },
      ],
    }).compile()

    controller = module.get<ProjectsController>(ProjectsController)
    projectApplicationService = module.get(ProjectApplicationService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createProject', () => {
    const createProjectDto: CreateProjectDto = {
      name: 'Test Project',
      description: 'Test Description',
    }

    it('should create project successfully', async () => {
      const mockResult = {
        success: true,
        data: { projectId: 'project-123' },
      }
      projectApplicationService.createProject.mockResolvedValue(mockResult)

      const result = await controller.createProject(createProjectDto, mockRequest)

      expect(result).toEqual({
        message: '项目创建成功',
        data: { projectId: 'project-123' },
      })
      expect(projectApplicationService.createProject).toHaveBeenCalledWith({
        ...createProjectDto,
        userId: 'user-123',
      })
    })

    it('should throw HttpException when creation fails', async () => {
      const mockResult = {
        success: false,
        error: '项目名称已存在',
      }
      projectApplicationService.createProject.mockResolvedValue(mockResult)

      await expect(controller.createProject(createProjectDto, mockRequest)).rejects.toThrow(
        new HttpException('项目名称已存在', HttpStatus.BAD_REQUEST)
      )
    })
  })

  describe('getUserProjects', () => {
    const query: GetUserProjectsDto = {
      page: 1,
      limit: 10,
      search: 'test',
      status: 'DRAFT',
    }

    it('should get user projects successfully', async () => {
      const mockResult = {
        success: true,
        data: {
          projects: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      }
      projectApplicationService.getUserProjects.mockResolvedValue(mockResult)

      const result = await controller.getUserProjects(query, mockRequest)

      expect(result).toEqual({
        message: '获取项目列表成功',
        data: mockResult.data,
      })
      expect(projectApplicationService.getUserProjects).toHaveBeenCalledWith({
        userId: 'user-123',
        page: 1,
        limit: 10,
        search: 'test',
        status: ProjectStatus.DRAFT,
      })
    })

    it('should use default values for page and limit', async () => {
      const emptyQuery = {}
      const mockResult = {
        success: true,
        data: {
          projects: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      }
      projectApplicationService.getUserProjects.mockResolvedValue(mockResult)

      await controller.getUserProjects(emptyQuery, mockRequest)

      expect(projectApplicationService.getUserProjects).toHaveBeenCalledWith({
        userId: 'user-123',
        page: 1,
        limit: 10,
        search: undefined,
        status: undefined,
      })
    })

    it('should throw HttpException when query fails', async () => {
      const mockResult = {
        success: false,
        error: 'Database error',
      }
      projectApplicationService.getUserProjects.mockResolvedValue(mockResult)

      await expect(controller.getUserProjects(query, mockRequest)).rejects.toThrow(
        new HttpException('Database error', HttpStatus.BAD_REQUEST)
      )
    })
  })

  describe('getProjectStats', () => {
    it('should get project stats successfully', async () => {
      const mockResult = {
        success: true,
        data: {
          total: 5,
          published: 2,
          draft: 2,
          archived: 1,
        },
      }
      projectApplicationService.getProjectStats.mockResolvedValue(mockResult)

      const result = await controller.getProjectStats(mockRequest)

      expect(result).toEqual({
        message: '获取项目统计信息成功',
        data: mockResult.data,
      })
      expect(projectApplicationService.getProjectStats).toHaveBeenCalledWith({
        userId: 'user-123',
      })
    })
  })

  describe('getRecentProjects', () => {
    it('should get recent projects successfully', async () => {
      const mockResult = {
        success: true,
        data: [],
      }
      projectApplicationService.getRecentProjects.mockResolvedValue(mockResult)

      const result = await controller.getRecentProjects(10, mockRequest)

      expect(result).toEqual({
        message: '获取最近项目成功',
        data: [],
      })
      expect(projectApplicationService.getRecentProjects).toHaveBeenCalledWith({
        userId: 'user-123',
        limit: 10,
      })
    })

    it('should use default limit when not provided', async () => {
      const mockResult = {
        success: true,
        data: [],
      }
      projectApplicationService.getRecentProjects.mockResolvedValue(mockResult)

      await controller.getRecentProjects(undefined, mockRequest)

      expect(projectApplicationService.getRecentProjects).toHaveBeenCalledWith({
        userId: 'user-123',
        limit: 5,
      })
    })
  })

  describe('getProject', () => {
    const projectId = 'project-123'

    it('should get project successfully', async () => {
      const mockProject = Project.fromPersistence({
        id: 'project-123',
        name: 'Test Project',
        description: 'Test Description',
        userId: 'user-123',
        status: ProjectStatus.DRAFT,
        config: { theme: 'dark' },
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      const mockResult = {
        success: true,
        data: mockProject,
      }
      projectApplicationService.getProject.mockResolvedValue(mockResult)

      const result = await controller.getProject(projectId, mockRequest)

      expect(result.message).toBe('获取项目详情成功')
      expect(result.data.id).toBe('project-123')
      expect(result.data.name).toBe('Test Project')
      expect(projectApplicationService.getProject).toHaveBeenCalledWith({
        projectId: 'project-123',
        userId: 'user-123',
      })
    })

    it('should throw NOT_FOUND when project does not exist', async () => {
      const mockResult = {
        success: false,
        error: '项目不存在',
      }
      projectApplicationService.getProject.mockResolvedValue(mockResult)

      await expect(controller.getProject(projectId, mockRequest)).rejects.toThrow(
        new HttpException('项目不存在', HttpStatus.NOT_FOUND)
      )
    })

    it('should throw BAD_REQUEST for other errors', async () => {
      const mockResult = {
        success: false,
        error: '无权限访问此项目',
      }
      projectApplicationService.getProject.mockResolvedValue(mockResult)

      await expect(controller.getProject(projectId, mockRequest)).rejects.toThrow(
        new HttpException('无权限访问此项目', HttpStatus.BAD_REQUEST)
      )
    })
  })

  describe('updateProject', () => {
    const projectId = 'project-123'
    const updateProjectDto: UpdateProjectDto = {
      name: 'Updated Project',
      description: 'Updated Description',
    }

    it('should update project successfully', async () => {
      const mockResult = {
        success: true,
      }
      projectApplicationService.updateProject.mockResolvedValue(mockResult)

      const result = await controller.updateProject(projectId, updateProjectDto, mockRequest)

      expect(result).toEqual({
        message: '项目更新成功',
      })
      expect(projectApplicationService.updateProject).toHaveBeenCalledWith({
        projectId: 'project-123',
        userId: 'user-123',
        ...updateProjectDto,
      })
    })

    it('should throw appropriate exception when update fails', async () => {
      const mockResult = {
        success: false,
        error: '项目不存在',
      }
      projectApplicationService.updateProject.mockResolvedValue(mockResult)

      await expect(
        controller.updateProject(projectId, updateProjectDto, mockRequest)
      ).rejects.toThrow(new HttpException('项目不存在', HttpStatus.NOT_FOUND))
    })
  })

  describe('publishProject', () => {
    const projectId = 'project-123'

    it('should publish project successfully', async () => {
      const mockResult = {
        success: true,
      }
      projectApplicationService.publishProject.mockResolvedValue(mockResult)

      const result = await controller.publishProject(projectId, mockRequest)

      expect(result).toEqual({
        message: '项目发布成功',
      })
      expect(projectApplicationService.publishProject).toHaveBeenCalledWith({
        projectId: 'project-123',
        userId: 'user-123',
      })
    })

    it('should throw exception when publish fails', async () => {
      const mockResult = {
        success: false,
        error: '项目至少需要一个页面才能发布',
      }
      projectApplicationService.publishProject.mockResolvedValue(mockResult)

      await expect(controller.publishProject(projectId, mockRequest)).rejects.toThrow(
        new HttpException('项目至少需要一个页面才能发布', HttpStatus.BAD_REQUEST)
      )
    })
  })

  describe('deleteProject', () => {
    const projectId = 'project-123'

    it('should delete project successfully', async () => {
      const mockResult = {
        success: true,
      }
      projectApplicationService.deleteProject.mockResolvedValue(mockResult)

      const result = await controller.deleteProject(projectId, mockRequest)

      expect(result).toEqual({
        message: '项目删除成功',
      })
      expect(projectApplicationService.deleteProject).toHaveBeenCalledWith({
        projectId: 'project-123',
        userId: 'user-123',
      })
    })

    it('should throw exception when delete fails', async () => {
      const mockResult = {
        success: false,
        error: '项目不存在',
      }
      projectApplicationService.deleteProject.mockResolvedValue(mockResult)

      await expect(controller.deleteProject(projectId, mockRequest)).rejects.toThrow(
        new HttpException('项目不存在', HttpStatus.NOT_FOUND)
      )
    })
  })
})