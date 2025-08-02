import { DomainError } from '../errors/domain-error'

// 主题配置值对象
export class ThemeConfig {
  private constructor(
    private readonly _primaryColor: string,
    private readonly _fontSize: 'small' | 'medium' | 'large',
    private readonly _fontFamily: 'default' | 'serif' | 'monospace'
  ) {}

  static create(config: {
    primaryColor?: string
    fontSize?: 'small' | 'medium' | 'large'
    fontFamily?: 'default' | 'serif' | 'monospace'
  }): ThemeConfig {
    const primaryColor = config.primaryColor || '#1890ff'
    const fontSize = config.fontSize || 'medium'
    const fontFamily = config.fontFamily || 'default'

    // 验证配置
    ThemeConfig.validatePrimaryColor(primaryColor)
    ThemeConfig.validateFontSize(fontSize)
    ThemeConfig.validateFontFamily(fontFamily)

    return new ThemeConfig(primaryColor, fontSize, fontFamily)
  }

  static fromJSON(data: any): ThemeConfig {
    if (!data || typeof data !== 'object') {
      return ThemeConfig.default()
    }

    return ThemeConfig.create({
      primaryColor: data.primaryColor,
      fontSize: data.fontSize,
      fontFamily: data.fontFamily,
    })
  }

  static default(): ThemeConfig {
    return ThemeConfig.create({})
  }

  // 验证方法
  private static validatePrimaryColor(color: string): void {
    if (!color || typeof color !== 'string') {
      throw new DomainError('主色调不能为空')
    }

    // 简单的十六进制颜色验证
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    if (!hexColorRegex.test(color)) {
      throw new DomainError('主色调必须为有效的十六进制颜色值')
    }
  }

  private static validateFontSize(fontSize: string): void {
    if (!['small', 'medium', 'large'].includes(fontSize)) {
      throw new DomainError('字体大小必须为 small、medium 或 large')
    }
  }

  private static validateFontFamily(fontFamily: string): void {
    if (!['default', 'serif', 'monospace'].includes(fontFamily)) {
      throw new DomainError('字体族必须为 default、serif 或 monospace')
    }
  }

  // 获取CSS值
  getFontSizeValue(): string {
    switch (this._fontSize) {
      case 'small':
        return '12px'
      case 'medium':
        return '14px'
      case 'large':
        return '16px'
      default:
        return '14px'
    }
  }

  getFontFamilyValue(): string {
    switch (this._fontFamily) {
      case 'serif':
        return 'serif'
      case 'monospace':
        return 'monospace'
      case 'default':
      default:
        return '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }
  }

  // 创建修改后的新实例
  withPrimaryColor(color: string): ThemeConfig {
    ThemeConfig.validatePrimaryColor(color)
    return new ThemeConfig(color, this._fontSize, this._fontFamily)
  }

  withFontSize(fontSize: 'small' | 'medium' | 'large'): ThemeConfig {
    ThemeConfig.validateFontSize(fontSize)
    return new ThemeConfig(this._primaryColor, fontSize, this._fontFamily)
  }

  withFontFamily(fontFamily: 'default' | 'serif' | 'monospace'): ThemeConfig {
    ThemeConfig.validateFontFamily(fontFamily)
    return new ThemeConfig(this._primaryColor, this._fontSize, fontFamily)
  }

  // Getters
  get primaryColor(): string {
    return this._primaryColor
  }
  get fontSize(): string {
    return this._fontSize
  }
  get fontFamily(): string {
    return this._fontFamily
  }

  // 比较方法
  equals(other: ThemeConfig): boolean {
    return (
      this._primaryColor === other._primaryColor &&
      this._fontSize === other._fontSize &&
      this._fontFamily === other._fontFamily
    )
  }

  toJSON() {
    return {
      primaryColor: this._primaryColor,
      fontSize: this._fontSize,
      fontFamily: this._fontFamily,
    }
  }

  toCSSVariables() {
    return {
      '--primary-color': this._primaryColor,
      '--font-size': this.getFontSizeValue(),
      '--font-family': this.getFontFamilyValue(),
    }
  }
}

// 导航配置值对象
export class NavigationConfig {
  private constructor(
    private readonly _showHeader: boolean,
    private readonly _headerTitle: string,
    private readonly _menuItems: Array<{ label: string; path: string }>
  ) {}

  static create(config: {
    showHeader?: boolean
    headerTitle?: string
    menuItems?: Array<{ label: string; path: string }>
  }): NavigationConfig {
    const showHeader = config.showHeader !== undefined ? config.showHeader : true
    const headerTitle = config.headerTitle || '我的网站'
    const menuItems = config.menuItems || []

    // 验证配置
    NavigationConfig.validateHeaderTitle(headerTitle)
    NavigationConfig.validateMenuItems(menuItems)

    return new NavigationConfig(showHeader, headerTitle, menuItems)
  }

  static fromJSON(data: any): NavigationConfig | undefined {
    if (!data || typeof data !== 'object') {
      return undefined
    }

    return NavigationConfig.create({
      showHeader: data.showHeader,
      headerTitle: data.headerTitle,
      menuItems: data.menuItems,
    })
  }

  // 验证方法
  private static validateHeaderTitle(title: string): void {
    if (!title || typeof title !== 'string') {
      throw new DomainError('导航标题不能为空')
    }
    if (title.length > 50) {
      throw new DomainError('导航标题长度不能超过50个字符')
    }
  }

  private static validateMenuItems(items: Array<{ label: string; path: string }>): void {
    if (!Array.isArray(items)) {
      throw new DomainError('菜单项必须为数组')
    }

    if (items.length > 10) {
      throw new DomainError('菜单项数量不能超过10个')
    }

    for (const item of items) {
      if (!item.label || typeof item.label !== 'string') {
        throw new DomainError('菜单项标签不能为空')
      }
      if (item.label.length > 20) {
        throw new DomainError('菜单项标签长度不能超过20个字符')
      }
      if (!item.path || typeof item.path !== 'string') {
        throw new DomainError('菜单项路径不能为空')
      }
      if (!item.path.startsWith('/')) {
        throw new DomainError('菜单项路径必须以 / 开头')
      }
    }

    // 检查路径是否重复
    const paths = items.map(item => item.path)
    const uniquePaths = new Set(paths)
    if (paths.length !== uniquePaths.size) {
      throw new DomainError('菜单项路径不能重复')
    }
  }

  // 菜单项管理
  addMenuItem(label: string, path: string): NavigationConfig {
    const newItems = [...this._menuItems, { label, path }]
    NavigationConfig.validateMenuItems(newItems)

    return new NavigationConfig(this._showHeader, this._headerTitle, newItems)
  }

  removeMenuItem(path: string): NavigationConfig {
    const newItems = this._menuItems.filter(item => item.path !== path)
    return new NavigationConfig(this._showHeader, this._headerTitle, newItems)
  }

  updateMenuItem(oldPath: string, newLabel: string, newPath: string): NavigationConfig {
    const newItems = this._menuItems.map(item =>
      item.path === oldPath ? { label: newLabel, path: newPath } : item
    )
    NavigationConfig.validateMenuItems(newItems)

    return new NavigationConfig(this._showHeader, this._headerTitle, newItems)
  }

  // Getters
  get showHeader(): boolean {
    return this._showHeader
  }
  get headerTitle(): string {
    return this._headerTitle
  }
  get menuItems(): ReadonlyArray<{ label: string; path: string }> {
    return this._menuItems
  }

  toJSON() {
    return {
      showHeader: this._showHeader,
      headerTitle: this._headerTitle,
      menuItems: [...this._menuItems],
    }
  }
}

// 项目配置值对象
export class ProjectConfig {
  private constructor(
    private readonly _theme: ThemeConfig,
    private readonly _navigation?: NavigationConfig
  ) {}

  static create(config: { theme?: ThemeConfig; navigation?: NavigationConfig }): ProjectConfig {
    return new ProjectConfig(config.theme || ThemeConfig.default(), config.navigation)
  }

  static fromJSON(data: any): ProjectConfig {
    if (!data || typeof data !== 'object') {
      return ProjectConfig.default()
    }

    return ProjectConfig.create({
      theme: ThemeConfig.fromJSON(data.theme),
      navigation: NavigationConfig.fromJSON(data.navigation),
    })
  }

  static default(): ProjectConfig {
    return ProjectConfig.create({})
  }

  // 创建修改后的新实例
  withTheme(theme: ThemeConfig): ProjectConfig {
    return new ProjectConfig(theme, this._navigation)
  }

  withNavigation(navigation: NavigationConfig | undefined): ProjectConfig {
    return new ProjectConfig(this._theme, navigation)
  }

  // Getters
  get theme(): ThemeConfig {
    return this._theme
  }
  get navigation(): NavigationConfig | undefined {
    return this._navigation
  }

  // 比较方法
  equals(other: ProjectConfig): boolean {
    const navigationEquals =
      this._navigation && other._navigation
        ? JSON.stringify(this._navigation.toJSON()) === JSON.stringify(other._navigation.toJSON())
        : this._navigation === other._navigation

    return this._theme.equals(other._theme) && navigationEquals
  }

  toJSON() {
    return {
      theme: this._theme.toJSON(),
      navigation: this._navigation?.toJSON(),
    }
  }
}
