import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 👈 reads from Authorization: Bearer <token>
      secretOrKey: config.get('JWT_SECRET')!,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    // This runs automatically after signature is verified
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    return user; // 👈 NestJS attaches this to request.user
  }
}