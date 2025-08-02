import { ComponentProps } from '../value-objects/component-props.vo';
import { ComponentType } from '../types/component.types';
import { DomainError } from '../errors/domain-error';
import { generateId } from '../../common/utils/id-generator';

export class Component {
  private constructor(
    private readonly _id: string,
    private readonly _type: ComponentType,
    private _props: ComponentProps,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  // 工厂方法
  static create(type: ComponentType, props: Record<string, any>): Component {
    const validatedProps = ComponentProps.create(type, props);
    
    return new Component(
      generateId(),
      type,
      validatedProps,
      new Date(),
      new Date()
    );
  }

  // 从持久化数据重建实体
  static fromPersistence(data: {
    id: string;
    type: ComponentType;
    props: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }): Component {
    return new Component(
      data.id,
      data.type,
      ComponentProps.fromJSON(data.type, data.props),
      data.createdAt,
      data.updatedAt
    );
  }

  // 业务方法
  updateProps(props: Record<string, any>): void {
    this._props.update(props);
    this._updatedAt = new Date();
  }

  // 验证组件配置是否有效
  isValid(): boolean {
    try {
      return this._props.isValid();
    } catch {
      return false;
    }
  }

  // 获取组件配置用于渲染
  getRenderConfig(): { type: ComponentType; props: Record<string, any> } {
    return {
      type: this._type,
      props: this._props.values
    };
  }

  // Getters
  get id(): string { return this._id; }
  get type(): ComponentType { return this._type; }
  get props(): ComponentProps { return this._props; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // 持久化数据转换
  toPersistence() {
    return {
      id: this._id,
      type: this._type,
      props: this._props.toJSON(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}