import {
  Body,
  Controller,
  Get,
  Headers,
  Ip,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  GenerateTokenReqDto,
  GenerateTokenResDto,
} from './dto/generate-token.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AUTH_ERROR } from 'src/constants/error.const';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import {
  ApiJsonResult,
  ApiJsonResultResponse,
} from 'src/dto/api-json-result.dto';

const REFRESH_TOKEN_HEADER_KEY = 'Refresh-Token';

@Controller('auth')
@ApiTags('Auth')
@ApiExtraModels(ApiJsonResult)
@ApiBadRequestResponse({ description: '参数错误' })
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('token')
  @ApiOperation({ summary: '生成 token' })
  @ApiJsonResultResponse(GenerateTokenResDto)
  @ApiCreatedResponse({
    description: '获取 token 成功',
  })
  @ApiUnauthorizedResponse({
    description: `code - ${AUTH_ERROR.USER_NOT_FOUND}: 用户不存在, code - ${AUTH_ERROR.INVALID_PASSWORD}: 密码错误`,
  })
  @ApiForbiddenResponse({
    description: `code - ${AUTH_ERROR.USER_DISABLED}: 用户已被锁定, code - ${AUTH_ERROR.LOCK_USER}: 锁定用户`,
  })
  async token(
    @Body() body: GenerateTokenReqDto,
    @Ip() ip: string,
  ): Promise<GenerateTokenResDto> {
    const user = await this.userService.validateUser(
      body.email,
      body.password,
      ip,
    );
    const { accessToken, refreshToken } =
      await this.authService.generateJwtToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Get('refresh-token')
  @ApiHeader({ name: REFRESH_TOKEN_HEADER_KEY, description: '刷新 token' })
  @ApiOperation({ summary: '刷新 token' })
  @ApiJsonResultResponse(GenerateTokenResDto)
  @ApiOkResponse({
    description: '刷新 token 成功',
  })
  @ApiUnauthorizedResponse({
    description: `code - ${AUTH_ERROR.INVALID_REFRESH_TOKEN}: refresh token 无效`,
  })
  async refreshToken(
    @Headers(REFRESH_TOKEN_HEADER_KEY)
    refreshToken: string,
  ): Promise<GenerateTokenResDto> {
    const { isValid, id } =
      await this.authService.validateRefreshToken(refreshToken);

    if (!isValid) {
      throw new UnauthorizedException(
        ApiJsonResult.error(
          AUTH_ERROR.INVALID_REFRESH_TOKEN,
          'Invalid refresh token',
        ),
      );
    }

    const user = await this.userService.getUserById(id);

    const result = await this.authService.generateJwtToken(user);
    return result;
  }
}
