import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ApplicationModule } from '../../application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [ProjectsController],
})
export class ProjectsModule {}