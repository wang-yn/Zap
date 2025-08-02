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
  HttpException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PageApplicationService } from '../../application/services/page-application.service';
import { 
  CreatePageDto, 
  UpdatePageDto, 
  AddComponentDto, 
  UpdateComponentDto, 
  ReorderComponentsDto,
  GetProjectPagesDto 
} from './dto/page.dto';
import { PageMapper } from '../../infrastructure/database/mappers/page.mapper';

@ApiTags('Pages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/pages')
export class PagesController {
  constructor(
    private readonly pageApplicationService: PageApplicationService
  ) {}

  @Post()
  @ApiOperation({ summary: '创建页面' })
  @ApiResponse({ status: 201, description: '页面创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async createPage(
    @Param('projectId') projectId: string,
    @Body() createPageDto: CreatePageDto,
    @Request() req
  ) {
    const result = await this.pageApplicationService.createPage({
      projectId,
      userId: req.user.id,
      ...createPageDto
    });

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return {
      message: '页面创建成功',
      data: result.data
    };
  }

  @Get()
  @ApiOperation({ summary: '获取项目页面列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getProjectPages(
    @Param('projectId') projectId: string,
    @Query() query: GetProjectPagesDto,
    @Request() req
  ) {
    const result = await this.pageApplicationService.getProjectPages({
      projectId,
      userId: req.user.id,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      search: query.search,
      includeUnpublished: query.includeUnpublished
    });

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    // 转换为公开信息
    const transformedData = {
      ...result.data,
      pages: result.data.pages.map(page => PageMapper.toPublicInfo(page))
    };

    return {
      message: '获取页面列表成功',
      data: transformedData
    };
  }

  @Get(':pageId')
  @ApiOperation({ summary: '获取页面详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '页面不存在' })
  async getPage(
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Request() req
  ) {
    const result = await this.pageApplicationService.getPage({
      pageId,
      userId: req.user.id
    });

    if (!result.success) {
      const status = result.error?.includes('不存在') ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
      throw new HttpException(result.error, status);
    }

    return {
      message: '获取页面详情成功',
      data: {
        ...PageMapper.toPublicInfo(result.data),
        layout: result.data.layout.toJSON(),
        components: result.data.components.map(component => component.getRenderConfig())
      }
    };
  }

  @Get(':pageId/preview')
  @ApiOperation({ summary: '预览页面' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async previewPage(
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Request() req
  ) {
    const result = await this.pageApplicationService.previewPage({
      pageId,
      userId: req.user.id
    });

    if (!result.success) {
      const status = result.error?.includes('不存在') ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
      throw new HttpException(result.error, status);
    }

    return {
      message: '获取页面预览成功',
      data: result.data.renderData
    };
  }

  @Put(':pageId')
  @ApiOperation({ summary: '更新页面' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '页面不存在' })
  async updatePage(
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Body() updatePageDto: UpdatePageDto,
    @Request() req
  ) {
    const result = await this.pageApplicationService.updatePage({
      pageId,
      userId: req.user.id,
      ...updatePageDto
    });

    if (!result.success) {
      const status = result.error?.includes('不存在') ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
      throw new HttpException(result.error, status);
    }

    return {
      message: '页面更新成功'
    };
  }

  @Post(':pageId/publish')
  @ApiOperation({ summary: '发布页面' })
  @ApiResponse({ status: 200, description: '发布成功' })
  async publishPage(
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Request() req
  ) {
    const result = await this.pageApplicationService.publishPage({
      pageId,
      userId: req.user.id
    });

    if (!result.success) {
      const status = result.error?.includes('不存在') ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
      throw new HttpException(result.error, status);
    }

    return {
      message: '页面发布成功'
    };
  }

  @Post(':pageId/unpublish')
  @ApiOperation({ summary: '取消发布页面' })
  @ApiResponse({ status: 200, description: '取消发布成功' })
  async unpublishPage(
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Request() req
  ) {
    const result = await this.pageApplicationService.unpublishPage({
      pageId,
      userId: req.user.id
    });

    if (!result.success) {
      const status = result.error?.includes('不存在') ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
      throw new HttpException(result.error, status);
    }

    return {
      message: '页面取消发布成功'
    };
  }

  @Delete(':pageId')
  @ApiOperation({ summary: '删除页面' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async deletePage(
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Request() req
  ) {
    // 注意：这里需要实现删除页面的应用服务方法
    // 当前示例中暂时返回成功
    return {
      message: '页面删除成功'
    };
  }

  // 组件管理接口
  @Post(':pageId/components')
  @ApiOperation({ summary: '添加组件' })
  @ApiResponse({ status: 201, description: '组件添加成功' })
  async addComponent(
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Body() addComponentDto: AddComponentDto,
    @Request() req
  ) {
    const result = await this.pageApplicationService.addComponent({
      pageId,
      userId: req.user.id,
      ...addComponentDto
    });

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return {
      message: '组件添加成功',
      data: result.data
    };
  }

  @Put(':pageId/components/:componentId')
  @ApiOperation({ summary: '更新组件' })
  @ApiResponse({ status: 200, description: '组件更新成功' })
  async updateComponent(
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Param('componentId') componentId: string,
    @Body() updateComponentDto: UpdateComponentDto,
    @Request() req
  ) {
    const result = await this.pageApplicationService.updateComponent({
      pageId,
      componentId,
      userId: req.user.id,
      ...updateComponentDto
    });

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return {
      message: '组件更新成功'
    };
  }

  @Delete(':pageId/components/:componentId')
  @ApiOperation({ summary: '删除组件' })
  @ApiResponse({ status: 200, description: '组件删除成功' })
  async removeComponent(
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Param('componentId') componentId: string,
    @Request() req
  ) {
    const result = await this.pageApplicationService.removeComponent({
      pageId,
      componentId,
      userId: req.user.id
    });

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return {
      message: '组件删除成功'
    };
  }

  @Put(':pageId/components/reorder')
  @ApiOperation({ summary: '重新排序组件' })
  @ApiResponse({ status: 200, description: '排序成功' })
  async reorderComponents(
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Body() reorderDto: ReorderComponentsDto,
    @Request() req
  ) {
    const result = await this.pageApplicationService.reorderComponents({
      pageId,
      userId: req.user.id,
      ...reorderDto
    });

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return {
      message: '组件排序成功'
    };
  }
}