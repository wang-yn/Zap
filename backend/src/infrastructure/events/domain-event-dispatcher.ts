import { Injectable, Logger } from '@nestjs/common'
import {
  DomainEvent,
  DomainEventDispatcher,
  DomainEventHandler,
} from '../../domain/events/domain-event'

@Injectable()
export class InMemoryDomainEventDispatcher implements DomainEventDispatcher {
  private readonly logger = new Logger(InMemoryDomainEventDispatcher.name)
  private readonly handlers = new Map<string, DomainEventHandler[]>()

  /**
   * 注册事件处理器
   */
  register<T extends DomainEvent>(eventType: string, handler: DomainEventHandler<T>): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, [])
    }

    this.handlers.get(eventType)!.push(handler as DomainEventHandler)
    this.logger.log(`Registered handler for event type: ${eventType}`)
  }

  /**
   * 分发单个事件
   */
  async dispatch(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventType) || []

    if (handlers.length === 0) {
      this.logger.debug(`No handlers registered for event type: ${event.eventType}`)
      return
    }

    this.logger.debug(`Dispatching event: ${event.eventType} for aggregate: ${event.aggregateId}`)

    // 并行执行所有处理器
    const handlerPromises = handlers.map(async handler => {
      try {
        const startTime = Date.now()
        await handler.handle(event)
        const processingTime = Date.now() - startTime

        this.logger.debug(`Handler completed for ${event.eventType} in ${processingTime}ms`)
      } catch (error) {
        this.logger.error(`Handler failed for event ${event.eventType}:`, error.stack)
        // 不抛出错误，避免影响其他处理器
      }
    })

    await Promise.all(handlerPromises)
  }

  /**
   * 批量分发事件
   */
  async dispatchEvents(events: readonly DomainEvent[]): Promise<void> {
    if (events.length === 0) {
      return
    }

    this.logger.debug(`Dispatching ${events.length} events`)

    // 按顺序分发事件
    for (const event of events) {
      await this.dispatch(event)
    }
  }

  /**
   * 获取已注册的事件类型
   */
  getRegisteredEventTypes(): string[] {
    return Array.from(this.handlers.keys())
  }

  /**
   * 获取事件类型的处理器数量
   */
  getHandlerCount(eventType: string): number {
    return this.handlers.get(eventType)?.length || 0
  }

  /**
   * 清除所有处理器（主要用于测试）
   */
  clear(): void {
    this.handlers.clear()
    this.logger.log('All event handlers cleared')
  }
}
