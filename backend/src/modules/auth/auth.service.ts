import { Injectable, UnauthorizedException, Inject } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserRepository } from '../../domain/repositories/user.repository'
import { User } from '../../domain/entities/user.entity'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { USER_REPOSITORY } from '../../common/constants/injection-tokens'

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async validateUser(emailOrUsername: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmailOrUsername(emailOrUsername)
    if (user && (await user.validatePasswordMatch(password))) {
      return user
    }
    return null
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password)
    if (!user) {
      throw new UnauthorizedException('无效的邮箱/用户名或密码')
    }

    const payload = { email: user.email, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload),
      user: user.toPublicInfo(),
    }
  }

  async register(registerDto: RegisterDto) {
    // 检查邮箱是否已存在
    const emailExists = await this.userRepository.emailExists(registerDto.email)
    if (emailExists) {
      throw new UnauthorizedException('邮箱已被注册')
    }

    // 检查用户名是否已存在
    const usernameExists = await this.userRepository.usernameExists(registerDto.username)
    if (usernameExists) {
      throw new UnauthorizedException('用户名已被使用')
    }

    // 创建新用户（使用领域实体）
    const user = await User.create({
      email: registerDto.email,
      username: registerDto.username,
      password: registerDto.password,
      avatar: registerDto.avatar,
    })

    // 保存用户
    await this.userRepository.save(user)

    const payload = { email: user.email, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload),
      user: user.toPublicInfo(),
    }
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id)
  }
}
