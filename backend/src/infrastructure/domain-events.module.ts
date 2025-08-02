import { Module } from '@nestjs/common';
import { InMemoryDomainEventDispatcher } from './events/domain-event-dispatcher';
import { 
  ProjectCreatedEventHandler,
  ProjectPublishedEventHandler,
  ProjectNameChangedEventHandler
} from './events/event-handlers/project-event.handlers';
import { DOMAIN_EVENT_DISPATCHER } from '../common/constants/injection-tokens';

/**
 * 领域事件模块
 * 负责事件分发器和事件处理器的配置
 */
@Module({
  providers: [
    // 事件分发器
    {
      provide: DOMAIN_EVENT_DISPATCHER,
      useClass: InMemoryDomainEventDispatcher
    },
    
    // 事件处理器
    ProjectCreatedEventHandler,
    ProjectPublishedEventHandler,
    ProjectNameChangedEventHandler,
  ],
  exports: [
    DOMAIN_EVENT_DISPATCHER,
    ProjectCreatedEventHandler,
    ProjectPublishedEventHandler,
    ProjectNameChangedEventHandler,
  ]
})
export class DomainEventsModule {
  constructor(
    private readonly eventDispatcher: InMemoryDomainEventDispatcher,
    private readonly projectCreatedHandler: ProjectCreatedEventHandler,
    private readonly projectPublishedHandler: ProjectPublishedEventHandler,
    private readonly projectNameChangedHandler: ProjectNameChangedEventHandler,
  ) {
    this.registerEventHandlers();
  }

  /**
   * 注册所有事件处理器
   */
  private registerEventHandlers(): void {
    // 注册项目相关事件处理器
    this.eventDispatcher.register('ProjectCreated', this.projectCreatedHandler);
    this.eventDispatcher.register('ProjectPublished', this.projectPublishedHandler);
    this.eventDispatcher.register('ProjectNameChanged', this.projectNameChangedHandler);
    
    console.log('Domain event handlers registered successfully');
  }
}