import { ComponentType, ComponentRegistry, ComponentDefinition, ComponentAction } from '../types/component.types';
import { DomainError } from '../errors/domain-error';

export class ComponentProps {
  private constructor(
    private readonly _type: ComponentType,
    private _values: Record<string, any>
  ) {}

  static create(type: ComponentType, props: Record<string, any>): ComponentProps {
    const definition = ComponentRegistry[type];
    if (!definition) {
      throw new DomainError(`不支持的组件类型: ${type}`);
    }

    const validatedProps = this.validateProps(type, props, definition);
    return new ComponentProps(type, validatedProps);
  }

  static fromJSON(type: ComponentType, props: Record<string, any>): ComponentProps {
    return new ComponentProps(type, props);
  }

  update(props: Record<string, any>): void {
    const definition = ComponentRegistry[this._type];
    const validatedProps = ComponentProps.validateProps(this._type, props, definition);
    
    // 合并新属性，保留未更新的属性
    this._values = { ...this._values, ...validatedProps };
  }

  private static validateProps(
    type: ComponentType, 
    props: Record<string, any>,
    definition: ComponentDefinition
  ): Record<string, any> {
    const validated: Record<string, any> = {};
    
    // 首先应用默认值
    Object.assign(validated, definition.defaultProps);
    
    // 验证并应用传入的属性
    for (const [key, value] of Object.entries(props)) {
      if (!definition.configurable.includes(key)) {
        throw new DomainError(`组件 ${type} 不支持属性 ${key}`);
      }
      
      // 根据组件类型和属性进行特定验证
      this.validatePropValue(type, key, value);
      validated[key] = value;
    }
    
    return validated;
  }

  private static validatePropValue(type: ComponentType, key: string, value: any): void {
    switch (type) {
      case 'Text':
        this.validateTextProps(key, value);
        break;
      case 'Button':
        this.validateButtonProps(key, value);
        break;
      case 'Input':
        this.validateInputProps(key, value);
        break;
      case 'Image':
        this.validateImageProps(key, value);
        break;
      case 'Container':
        this.validateContainerProps(key, value);
        break;
      case 'Divider':
        this.validateDividerProps(key, value);
        break;
    }
  }

  private static validateTextProps(key: string, value: any): void {
    switch (key) {
      case 'content':
        if (!value || typeof value !== 'string') {
          throw new DomainError('文本内容不能为空');
        }
        if (value.length > 1000) {
          throw new DomainError('文本内容长度不能超过1000个字符');
        }
        break;
      case 'size':
        if (!['small', 'medium', 'large'].includes(value)) {
          throw new DomainError('文本大小必须为 small、medium 或 large');
        }
        break;
      case 'color':
        if (!['default', 'primary', 'secondary', 'success', 'warning', 'error'].includes(value)) {
          throw new DomainError('文本颜色值无效');
        }
        break;
      case 'align':
        if (!['left', 'center', 'right'].includes(value)) {
          throw new DomainError('文本对齐方式必须为 left、center 或 right');
        }
        break;
    }
  }

  private static validateButtonProps(key: string, value: any): void {
    switch (key) {
      case 'text':
        if (!value || typeof value !== 'string') {
          throw new DomainError('按钮文本不能为空');
        }
        if (value.length > 50) {
          throw new DomainError('按钮文本长度不能超过50个字符');
        }
        break;
      case 'type':
        if (!['primary', 'default', 'dashed', 'link', 'text'].includes(value)) {
          throw new DomainError('按钮类型无效');
        }
        break;
      case 'size':
        if (!['small', 'medium', 'large'].includes(value)) {
          throw new DomainError('按钮大小必须为 small、medium 或 large');
        }
        break;
      case 'disabled':
        if (typeof value !== 'boolean') {
          throw new DomainError('按钮禁用状态必须为布尔值');
        }
        break;
      case 'action':
        if (value && !this.isValidAction(value)) {
          throw new DomainError('按钮动作配置无效');
        }
        break;
    }
  }

  private static validateInputProps(key: string, value: any): void {
    switch (key) {
      case 'placeholder':
        if (value && typeof value !== 'string') {
          throw new DomainError('占位符必须为字符串');
        }
        if (value && value.length > 100) {
          throw new DomainError('占位符长度不能超过100个字符');
        }
        break;
      case 'type':
        if (!['text', 'password', 'email', 'number', 'tel', 'url'].includes(value)) {
          throw new DomainError('输入框类型无效');
        }
        break;
      case 'required':
        if (typeof value !== 'boolean') {
          throw new DomainError('必填状态必须为布尔值');
        }
        break;
      case 'maxLength':
        if (value !== undefined && (typeof value !== 'number' || value <= 0)) {
          throw new DomainError('最大长度必须为正整数');
        }
        break;
    }
  }

  private static validateImageProps(key: string, value: any): void {
    switch (key) {
      case 'src':
        if (!value || typeof value !== 'string') {
          throw new DomainError('图片地址不能为空');
        }
        // 简单的URL格式验证
        if (!value.startsWith('http') && !value.startsWith('/') && !value.startsWith('./')) {
          throw new DomainError('图片地址格式无效');
        }
        break;
      case 'alt':
        if (value && typeof value !== 'string') {
          throw new DomainError('图片描述必须为字符串');
        }
        break;
      case 'width':
      case 'height':
        if (value !== 'auto' && (typeof value !== 'number' || value <= 0)) {
          throw new DomainError(`图片${key === 'width' ? '宽度' : '高度'}必须为 auto 或正数`);
        }
        break;
    }
  }

  private static validateContainerProps(key: string, value: any): void {
    switch (key) {
      case 'padding':
        if (!['none', 'small', 'medium', 'large'].includes(value)) {
          throw new DomainError('容器内边距必须为 none、small、medium 或 large');
        }
        break;
      case 'background':
        if (!['none', 'light', 'dark'].includes(value)) {
          throw new DomainError('容器背景必须为 none、light 或 dark');
        }
        break;
      case 'border':
        if (typeof value !== 'boolean') {
          throw new DomainError('容器边框状态必须为布尔值');
        }
        break;
    }
  }

  private static validateDividerProps(key: string, value: any): void {
    switch (key) {
      case 'style':
        if (!['solid', 'dashed', 'dotted'].includes(value)) {
          throw new DomainError('分割线样式必须为 solid、dashed 或 dotted');
        }
        break;
      case 'spacing':
        if (!['small', 'medium', 'large'].includes(value)) {
          throw new DomainError('分割线间距必须为 small、medium 或 large');
        }
        break;
    }
  }

  private static isValidAction(action: any): action is ComponentAction {
    if (!action || typeof action !== 'object') {
      return false;
    }
    
    if (!action.type || !['navigate', 'submit', 'none'].includes(action.type)) {
      return false;
    }
    
    if (action.type === 'navigate' && (!action.target || typeof action.target !== 'string')) {
      return false;
    }
    
    return true;
  }

  // 验证当前配置是否有效
  isValid(): boolean {
    try {
      const definition = ComponentRegistry[this._type];
      ComponentProps.validateProps(this._type, this._values, definition);
      return true;
    } catch {
      return false;
    }
  }

  // 获取属性值
  get(key: string): any {
    return this._values[key];
  }

  // Getters
  get type(): ComponentType { return this._type; }
  get values(): Record<string, any> { return { ...this._values }; }

  // 序列化
  toJSON(): Record<string, any> {
    return { ...this._values };
  }
}