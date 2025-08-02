import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    description: '项目名称',
    example: '我的第一个项目',
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: '项目描述',
    example: '这是一个用于展示产品的项目',
    maxLength: 500
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: '项目配置'
  })
  @IsOptional()
  config?: any;
}

export class UpdateProjectDto {
  @ApiPropertyOptional({
    description: '项目名称',
    example: '我的项目（已更新）',
    maxLength: 100
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: '项目描述',
    maxLength: 500
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: '项目配置'
  })
  @IsOptional()
  config?: any;
}

export class GetUserProjectsDto {
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
    description: '项目状态',
    enum: ['draft', 'published', 'archived']
  })
  @IsString()
  @IsOptional()
  status?: string;
}