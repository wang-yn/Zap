import { Module } from '@nestjs/common';
import { ProjectApplicationService } from './services/project-application.service';
import { PageApplicationService } from './services/page-application.service';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { DomainEventsModule } from '../infrastructure/domain-events.module';

/**
 * 应用服务模块
 * 负责应用服务层的配置和依赖注入
 */
@Module({
  imports: [
    InfrastructureModule,
    DomainEventsModule,
  ],
  providers: [
    ProjectApplicationService,
    PageApplicationService,
  ],
  exports: [
    ProjectApplicationService,
    PageApplicationService,
  ]
})
export class ApplicationModule {}