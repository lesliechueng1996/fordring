import { Body, Controller, Ip, Post } from '@nestjs/common';
import {
  GenerateTokenReqDto,
  GenerateTokenResDto,
} from './dto/generate-token.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
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
}
