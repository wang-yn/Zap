import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { ProjectsModule } from './modules/projects/projects.module'
import { PagesModule } from './modules/pages/pages.module'
import { InfrastructureModule } from './infrastructure/infrastructure.module'
import { DomainEventsModule } from './infrastructure/domain-events.module'

@Module({
  imports: [
    // 基础设施模块
    InfrastructureModule,
    DomainEventsModule,

    // 业务模块
    AuthModule,
    ProjectsModule,
    PagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
