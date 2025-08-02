import { DomainError } from '../errors/domain-error';

export class PageLayout {
  private constructor(
    private readonly _maxWidth: number | 'full',
    private readonly _padding: 'none' | 'small' | 'medium' | 'large',
    private readonly _spacing: 'compact' | 'normal' | 'loose'
  ) {}

  static create(config: {
    maxWidth?: number | 'full';
    padding?: 'none' | 'small' | 'medium' | 'large';
    spacing?: 'compact' | 'normal' | 'loose';
  }): PageLayout {
    const maxWidth = config.maxWidth || 1200;
    const padding = config.padding || 'medium';
    const spacing = config.spacing || 'normal';

    // 验证配置
    PageLayout.validateMaxWidth(maxWidth);
    PageLayout.validatePadding(padding);
    PageLayout.validateSpacing(spacing);

    return new PageLayout(maxWidth, padding, spacing);
  }

  static fromJSON(data: any): PageLayout {
    if (!data || typeof data !== 'object') {
      return PageLayout.default();
    }

    return PageLayout.create({
      maxWidth: data.maxWidth,
      padding: data.padding,
      spacing: data.spacing
    });
  }

  static default(): PageLayout {
    return PageLayout.create({});
  }

  // 验证方法
  private static validateMaxWidth(maxWidth: number | 'full'): void {
    if (maxWidth !== 'full') {
      if (typeof maxWidth !== 'number' || maxWidth <= 0) {
        throw new DomainError('页面最大宽度必须为正数或 "full"');
      }
      if (maxWidth < 320) {
        throw new DomainError('页面最大宽度不能小于320px');
      }
      if (maxWidth > 2560) {
        throw new DomainError('页面最大宽度不能大于2560px');
      }
    }
  }

  private static validatePadding(padding: string): void {
    if (!['none', 'small', 'medium', 'large'].includes(padding)) {
      throw new DomainError('页面内边距必须为 none、small、medium 或 large');
    }
  }

  private static validateSpacing(spacing: string): void {
    if (!['compact', 'normal', 'loose'].includes(spacing)) {
      throw new DomainError('页面间距必须为 compact、normal 或 loose');
    }
  }

  // 获取CSS样式值
  getMaxWidthValue(): string {
    return this._maxWidth === 'full' ? '100%' : `${this._maxWidth}px`;
  }

  getPaddingValue(): string {
    switch (this._padding) {
      case 'none': return '0';
      case 'small': return '8px';
      case 'medium': return '16px';
      case 'large': return '24px';
      default: return '16px';
    }
  }

  getSpacingValue(): string {
    switch (this._spacing) {
      case 'compact': return '8px';
      case 'normal': return '16px';
      case 'loose': return '24px';
      default: return '16px';
    }
  }

  // 创建一个修改后的新实例
  withMaxWidth(maxWidth: number | 'full'): PageLayout {
    PageLayout.validateMaxWidth(maxWidth);
    return new PageLayout(maxWidth, this._padding, this._spacing);
  }

  withPadding(padding: 'none' | 'small' | 'medium' | 'large'): PageLayout {
    PageLayout.validatePadding(padding);
    return new PageLayout(this._maxWidth, padding, this._spacing);
  }

  withSpacing(spacing: 'compact' | 'normal' | 'loose'): PageLayout {
    PageLayout.validateSpacing(spacing);
    return new PageLayout(this._maxWidth, this._padding, spacing);
  }

  // Getters
  get maxWidth(): number | 'full' { return this._maxWidth; }
  get padding(): string { return this._padding; }
  get spacing(): string { return this._spacing; }

  // 比较方法
  equals(other: PageLayout): boolean {
    return this._maxWidth === other._maxWidth &&
           this._padding === other._padding &&
           this._spacing === other._spacing;
  }

  // 序列化
  toJSON() {
    return {
      maxWidth: this._maxWidth,
      padding: this._padding,
      spacing: this._spacing
    };
  }

  // 用于CSS的完整样式对象
  toCSSObject() {
    return {
      maxWidth: this.getMaxWidthValue(),
      padding: this.getPaddingValue(),
      gap: this.getSpacingValue()
    };
  }
}