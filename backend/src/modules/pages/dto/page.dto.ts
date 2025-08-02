import { IsString, IsOptional, IsNotEmpty, MaxLength, IsObject, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ComponentType } from '../../../domain/types/component.types';

export class CreatePageDto {
  @ApiProperty({
    description: '页面名称',
    example: '首页',
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: '页面路径',
    example: '/',
    maxLength: 200
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  path: string;

  @ApiPropertyOptional({
    description: '页面标题',
    example: '欢迎来到我的网站',
    maxLength: 200
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({
    description: '页面布局配置'
  })
  @IsObject()
  @IsOptional()
  layout?: any;
}

export class UpdatePageDto {
  @ApiPropertyOptional({
    description: '页面名称',
    maxLength: 100
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: '页面路径',
    maxLength: 200
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  path?: string;

  @ApiPropertyOptional({
    description: '页面标题',
    maxLength: 200
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({
    description: '页面布局配置'
  })
  @IsObject()
  @IsOptional()
  layout?: any;
}

export class AddComponentDto {
  @ApiProperty({
    description: '组件类型',
    enum: ['Text', 'Button', 'Input', 'Image', 'Container', 'Divider'],
    example: 'Text'
  })
  @IsString()
  @IsNotEmpty()
  componentType: ComponentType;

  @ApiProperty({
    description: '组件属性',
    example: { content: '欢迎访问', size: 'large', color: 'primary' }
  })
  @IsObject()
  props: Record<string, any>;

  @ApiPropertyOptional({
    description: '插入位置（可选）',
    example: 0
  })
  @IsNumber()
  @IsOptional()
  position?: number;
}

export class UpdateComponentDto {
  @ApiProperty({
    description: '组件属性',
    example: { content: '更新后的内容', size: 'medium' }
  })
  @IsObject()
  props: Record<string, any>;
}

export class ReorderComponentsDto {
  @ApiProperty({
    description: '组件ID数组（新的排序）',
    example: ['comp1', 'comp2', 'comp3']
  })
  @IsArray()
  @IsString({ each: true })
  componentIds: string[];
}

export class GetProjectPagesDto {
  @ApiPropertyOptional({
    description: '页码',
    example: 1,
    default: 1
  })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: '每页数量',
    example: 10,
    default: 10
  })
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: '搜索关键词'
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: '是否包含未发布页面',
    default: true
  })
  @IsOptional()
  includeUnpublished?: boolean = true;
}