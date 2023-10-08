import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { User } from 'src/entities/user.entity';
import { APP_NAME } from 'src/constants/fordring.const';

const REFRESH_TOKEN_PREFIX = `${APP_NAME}:refresh-token:`;
const REFRESH_TOKEN_EXPIRE_MS = 7 * 24 * 60 * 60 * 1000;

type JwtPayload = {
  id: string;
  nickName: string;
  avatarUrl: string | null;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManger: Cache,
  ) {}

  async generateJwtToken(user: User) {
    const payload: JwtPayload = {
      id: user.id,
      nickName: user.nickName,
      avatarUrl: user.avatarUrl,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
    this.logger.log(`Generated JWT Token for user ${user.id}`);

    await this.cacheManger.set(
      `${REFRESH_TOKEN_PREFIX}${user.id}`,
      refreshToken,
      REFRESH_TOKEN_EXPIRE_MS,
    );
    this.logger.log(`Saved refresh token for user ${user.id}`);

    return {
      accessToken,
      refreshToken,
    };
  }

  async decodeJwtToken(token: string) {
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch (e) {
      this.logger.error(`Invalid access token, error: ${e}`);
      return null;
    }
  }

  async verifyRefreshToken(refreshToken: string) {
    const payload = await this.decodeJwtToken(refreshToken);
    if (!payload) {
      return false;
    }
    const { id } = payload;
    const cachedRefreshToken = await this.cacheManger.get(
      `${REFRESH_TOKEN_PREFIX}${id}`,
    );
    if (cachedRefreshToken !== refreshToken) {
      return false;
    }
    return true;
  }
}
