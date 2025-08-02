import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from '../auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    })
  }

  async validate(payload: any) {
    // 验证用户是否仍然存在
    const user = await this.authService.findUserById(payload.sub)
    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }

    return { 
      id: user.id, 
      email: user.email, 
      username: user.username,
      avatar: user.avatar 
    }
  }
}
