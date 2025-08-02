import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpException,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ProjectApplicationService } from '../../application/services/project-application.service'
import { CreateProjectDto, UpdateProjectDto, GetUserProjectsDto } from './dto/project.dto'
import { ProjectStatus } from '../../domain/entities/project.entity'

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectApplicationService: ProjectApplicationService) {}

  @Post()
  @ApiOperation({ summary: '创建项目' })
  @ApiResponse({ status: 201, description: '项目创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async createProject(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    const result = await this.projectApplicationService.createProject({
      ...createProjectDto,
      userId: req.user.id,
    })

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST)
    }

    return {
      message: '项目创建成功',
      data: result.data,
    }
  }

  @Get()
  @ApiOperation({ summary: '获取用户项目列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getUserProjects(@Query() query: GetUserProjectsDto, @Request() req) {
    const result = await this.projectApplicationService.getUserProjects({
      userId: req.user.id,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      search: query.search,
      status: query.status as ProjectStatus,
    })

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST)
    }

    return {
      message: '获取项目列表成功',
      data: result.data,
    }
  }

  @Get('stats')
  @ApiOperation({ summary: '获取项目统计信息' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getProjectStats(@Request() req) {
    const result = await this.projectApplicationService.getProjectStats({
      userId: req.user.id,
    })

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST)
    }

    return {
      message: '获取项目统计信息成功',
      data: result.data,
    }
  }

  @Get('recent')
  @ApiOperation({ summary: '获取最近更新的项目' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getRecentProjects(@Query('limit') limit?: number, @Request() req?) {
    const result = await this.projectApplicationService.getRecentProjects({
      userId: req.user.id,
      limit: Number(limit) || 5,
    })

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST)
    }

    return {
      message: '获取最近项目成功',
      data: result.data,
    }
  }

  @Get(':id')
  @ApiOperation({ summary: '获取项目详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '项目不存在' })
  async getProject(@Param('id') id: string, @Request() req) {
    const result = await this.projectApplicationService.getProject({
      projectId: id,
      userId: req.user.id,
    })

    if (!result.success) {
      const status = result.error?.includes('不存在')
        ? HttpStatus.NOT_FOUND
        : HttpStatus.BAD_REQUEST
      throw new HttpException(result.error, status)
    }

    return {
      message: '获取项目详情成功',
      data: {
        id: result.data.id,
        name: result.data.name,
        description: result.data.description,
        status: result.data.status,
        config: result.data.config.toJSON(),
        createdAt: result.data.createdAt,
        updatedAt: result.data.updatedAt,
      },
    }
  }

  @Put(':id')
  @ApiOperation({ summary: '更新项目' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '项目不存在' })
  async updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req
  ) {
    const result = await this.projectApplicationService.updateProject({
      projectId: id,
      userId: req.user.id,
      ...updateProjectDto,
    })

    if (!result.success) {
      const status = result.error?.includes('不存在')
        ? HttpStatus.NOT_FOUND
        : HttpStatus.BAD_REQUEST
      throw new HttpException(result.error, status)
    }

    return {
      message: '项目更新成功',
    }
  }

  @Post(':id/publish')
  @ApiOperation({ summary: '发布项目' })
  @ApiResponse({ status: 200, description: '发布成功' })
  @ApiResponse({ status: 404, description: '项目不存在' })
  async publishProject(@Param('id') id: string, @Request() req) {
    const result = await this.projectApplicationService.publishProject({
      projectId: id,
      userId: req.user.id,
    })

    if (!result.success) {
      const status = result.error?.includes('不存在')
        ? HttpStatus.NOT_FOUND
        : HttpStatus.BAD_REQUEST
      throw new HttpException(result.error, status)
    }

    return {
      message: '项目发布成功',
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除项目' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '项目不存在' })
  async deleteProject(@Param('id') id: string, @Request() req) {
    const result = await this.projectApplicationService.deleteProject({
      projectId: id,
      userId: req.user.id,
    })

    if (!result.success) {
      const status = result.error?.includes('不存在')
        ? HttpStatus.NOT_FOUND
        : HttpStatus.BAD_REQUEST
      throw new HttpException(result.error, status)
    }

    return {
      message: '项目删除成功',
    }
  }
}
