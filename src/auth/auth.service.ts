import type { StringValue } from 'ms';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { RefreshResponse, SignInResponse, TokenPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async signIn(login: string, password: string): Promise<SignInResponse> {
    const user = await this.prisma.user.findFirst({ where: { login } });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new ForbiddenException('Password is incorrect');
    }

    const payload: TokenPayload = { userId: user.id, login: user.login };

    return this.createTokensPair(payload);
  }

  async signUp(login: string, password: string) {
    return await this.userService.create({ login, password });
  }

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const payload: TokenPayload =
        await this.jwtService.verifyAsync(refreshToken);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      const dbPayload: TokenPayload = { userId: user.id, login: user.login };

      return this.createTokensPair(dbPayload);
    } catch {
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }

  private createTokensPair = async (payload: TokenPayload) => ({
    accessToken: await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: (process.env.TOKEN_EXPIRE_TIME ?? '15m') as StringValue,
    }),
    refreshToken: await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: (process.env.TOKEN_REFRESH_EXPIRE_TIME ?? '1d') as StringValue,
    }),
  });
}
