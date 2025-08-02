import { DomainError } from '../errors/domain-error'
import { generateId } from '../../common/utils/id-generator'
import * as bcrypt from 'bcrypt'

export class User {
  private constructor(
    private readonly _id: string,
    private _email: string,
    private _username: string,
    private _password: string,
    private _avatar: string | null,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  // 工厂方法 - 创建新用户
  static async create(data: {
    email: string
    username: string
    password: string
    avatar?: string
  }): Promise<User> {
    const user = new User(
      generateId(),
      data.email,
      data.username,
      await User.hashPassword(data.password),
      data.avatar || null,
      new Date(),
      new Date()
    )

    user.validateEmail(data.email)
    user.validateUsername(data.username)
    user.validatePassword(data.password)

    return user
  }

  // 从持久化数据重建实体
  static fromPersistence(data: {
    id: string
    email: string
    username: string
    password: string
    avatar: string | null
    createdAt: Date
    updatedAt: Date
  }): User {
    return new User(
      data.id,
      data.email,
      data.username,
      data.password,
      data.avatar,
      data.createdAt,
      data.updatedAt
    )
  }

  // 业务方法
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const isValidOldPassword = await this.validatePasswordMatch(oldPassword)
    if (!isValidOldPassword) {
      throw new DomainError('原密码不正确')
    }

    this.validatePassword(newPassword)
    this._password = await User.hashPassword(newPassword)
    this._updatedAt = new Date()
  }

  updateProfile(data: { username?: string; avatar?: string }): void {
    if (data.username !== undefined) {
      this.validateUsername(data.username)
      this._username = data.username
    }

    if (data.avatar !== undefined) {
      this._avatar = data.avatar
    }

    this._updatedAt = new Date()
  }

  updateEmail(newEmail: string): void {
    this.validateEmail(newEmail)
    this._email = newEmail
    this._updatedAt = new Date()
  }

  // 密码验证
  async validatePasswordMatch(password: string): Promise<boolean> {
    return bcrypt.compare(password, this._password)
  }

  // 业务规则验证
  private validateEmail(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new DomainError('邮箱不能为空')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new DomainError('邮箱格式不正确')
    }

    if (email.length > 255) {
      throw new DomainError('邮箱长度不能超过255个字符')
    }
  }

  private validateUsername(username: string): void {
    if (!username || username.trim().length === 0) {
      throw new DomainError('用户名不能为空')
    }

    if (username.length < 2) {
      throw new DomainError('用户名长度不能少于2个字符')
    }

    if (username.length > 50) {
      throw new DomainError('用户名长度不能超过50个字符')
    }

    // 用户名只能包含字母、数字、下划线和中文
    const usernameRegex = /^[\w\u4e00-\u9fa5]+$/
    if (!usernameRegex.test(username)) {
      throw new DomainError('用户名只能包含字母、数字、下划线和中文')
    }
  }

  private validatePassword(password: string): void {
    if (!password || password.length === 0) {
      throw new DomainError('密码不能为空')
    }

    if (password.length < 6) {
      throw new DomainError('密码长度不能少于6个字符')
    }

    if (password.length > 100) {
      throw new DomainError('密码长度不能超过100个字符')
    }

    // 密码必须包含字母和数字
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasNumber = /\d/.test(password)

    if (!hasLetter || !hasNumber) {
      throw new DomainError('密码必须同时包含字母和数字')
    }
  }

  // 辅助方法
  private static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
  }

  // Getters
  get id(): string {
    return this._id
  }
  get email(): string {
    return this._email
  }
  get username(): string {
    return this._username
  }
  get avatar(): string | null {
    return this._avatar
  }
  get createdAt(): Date {
    return this._createdAt
  }
  get updatedAt(): Date {
    return this._updatedAt
  }

  // 用于认证的安全方法
  getPasswordHash(): string {
    return this._password
  }

  // 持久化数据转换
  toPersistence() {
    return {
      id: this._id,
      email: this._email,
      username: this._username,
      password: this._password,
      avatar: this._avatar,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    }
  }

  // 公开信息（不包含敏感数据）
  toPublicInfo() {
    return {
      id: this._id,
      email: this._email,
      username: this._username,
      avatar: this._avatar,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    }
  }
}
