import { GenerateTokenReq, GenerateTokenRes } from '@fordring/api-type';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class GenerateTokenReqDto implements GenerateTokenReq {
  @ApiProperty({
    description: '邮箱',
    example: 'xxx@qq.com',
    maxLength: 128,
  })
  @IsEmail()
  @MaxLength(128)
  email: string;

  @ApiProperty({
    description: '密码',
    example: '123456',
    maxLength: 64,
  })
  @IsNotEmpty()
  @MaxLength(64)
  password: string;
}

export class GenerateTokenResDto implements GenerateTokenRes {
  @ApiProperty({ description: '访问令牌' })
  accessToken: string;

  @ApiProperty({ description: '刷新令牌' })
  refreshToken: string;
}
