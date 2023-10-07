import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserStatus } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { validatePassword } from 'src/utils/password.util';
import { AUTH_ERROR } from 'src/constants/error.const';
import { ApiJsonResult } from 'src/dto/api-json-result.dto';

const MAX_ERROR_COUNT = 5;

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async validateUser(
    email: string,
    password: string,
    ip: string,
  ): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      // User not found
      this.logger.error(`User not found: ${email}`);
      throw new UnauthorizedException(
        ApiJsonResult.error(AUTH_ERROR.USER_NOT_FOUND, 'User not found'),
      );
    }

    if (user.status === UserStatus.DISABLED) {
      // User is disabled
      this.logger.error(`User is disabled: ${email}`);
      throw new ForbiddenException(
        ApiJsonResult.error(AUTH_ERROR.USER_DISABLED, 'User is disabled'),
      );
    }

    const isPasswordValid = await validatePassword(password, user.password);
    if (!isPasswordValid) {
      this.logger.error(`Invalid password: ${email}`);

      user.errorCount++;
      this.updateUserErrorInfo(user, ip);

      if (user.errorCount >= MAX_ERROR_COUNT) {
        // Lock user
        this.logger.error(`Lock user: ${email}`);
        this.lockUser(user);
        throw new ForbiddenException(
          ApiJsonResult.error(AUTH_ERROR.LOCK_USER, 'Lock user'),
        );
      }

      throw new UnauthorizedException(
        ApiJsonResult.error(AUTH_ERROR.INVALID_PASSWORD, 'Invalid password', {
          count: MAX_ERROR_COUNT - user.errorCount,
        }),
      );
    }

    // Success, reset error count, update last_login_time and last_login_ip
    this.logger.log(`Login success: ${email}`);
    await this.usersRepository.update(user.id, {
      errorCount: 0,
      lastLoginTime: new Date(),
      lastLoginIp: ip,
    });
    return user;
  }

  async updateUserErrorInfo(user: User, ip: string) {
    await this.usersRepository.update(user.id, {
      lastErrorTime: new Date(),
      lastErrorIp: ip,
      errorCount: user.errorCount,
    });
  }

  async lockUser(user: User) {
    await this.usersRepository.update(user.id, {
      status: UserStatus.DISABLED,
    });
  }
}
