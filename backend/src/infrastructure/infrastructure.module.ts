import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { PrismaUserRepository } from './database/repositories/prisma-user.repository';
import { PrismaProjectRepository } from './database/repositories/prisma-project.repository';
import { PrismaPageRepository } from './database/repositories/prisma-page.repository';
import { 
  USER_REPOSITORY, 
  PROJECT_REPOSITORY, 
  PAGE_REPOSITORY 
} from '../common/constants/injection-tokens';

/**
 * 基础设施模块
 * 负责仓储实现和数据访问层的配置
 */
@Module({
  providers: [
    PrismaService,
    
    // 仓储实现
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository
    },
    {
      provide: PROJECT_REPOSITORY,
      useClass: PrismaProjectRepository
    },
    {
      provide: PAGE_REPOSITORY,
      useClass: PrismaPageRepository
    },
  ],
  exports: [
    PrismaService,
    USER_REPOSITORY,
    PROJECT_REPOSITORY,
    PAGE_REPOSITORY,
  ]
})
export class InfrastructureModule {}