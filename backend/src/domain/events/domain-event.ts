import { generateId } from '../../common/utils/id-generator';

/**
 * 基础领域事件抽象类
 */
export abstract class DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly eventType: string
  ) {
    this.eventId = generateId();
    this.occurredAt = new Date();
  }

  // 序列化事件数据
  abstract getEventData(): Record<string, any>;

  // 事件的完整数据
  toJSON() {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      occurredAt: this.occurredAt.toISOString(),
      data: this.getEventData()
    };
  }
}

/**
 * 领域事件处理器接口
 */
export interface DomainEventHandler<T extends DomainEvent = DomainEvent> {
  handle(event: T): Promise<void>;
}

/**
 * 领域事件分发器接口
 */
export interface DomainEventDispatcher {
  /**
   * 注册事件处理器
   */
  register<T extends DomainEvent>(
    eventType: string, 
    handler: DomainEventHandler<T>
  ): void;

  /**
   * 分发单个事件
   */
  dispatch(event: DomainEvent): Promise<void>;

  /**
   * 批量分发事件
   */
  dispatchEvents(events: readonly DomainEvent[]): Promise<void>;
}

/**
 * 事件处理结果
 */
export interface EventHandlingResult {
  success: boolean;
  error?: Error;
  processingTime: number;
}

/**
 * 事件存储接口（可选，用于事件溯源）
 */
export interface EventStore {
  /**
   * 保存事件
   */
  save(event: DomainEvent): Promise<void>;

  /**
   * 获取聚合的所有事件
   */
  getEvents(aggregateId: string): Promise<DomainEvent[]>;

  /**
   * 获取指定类型的事件
   */
  getEventsByType(eventType: string): Promise<DomainEvent[]>;
}