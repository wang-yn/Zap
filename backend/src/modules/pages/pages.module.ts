import { Module } from '@nestjs/common';
import { PagesController } from './pages.controller';
import { ApplicationModule } from '../../application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [PagesController],
})
export class PagesModule {}