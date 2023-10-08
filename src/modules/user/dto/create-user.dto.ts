import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUserReqDto {
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

  @ApiProperty({
    description: '昵称',
    example: 'Leslie',
    maxLength: 32,
  })
  @IsNotEmpty()
  @MaxLength(32)
  nickName: string;
}
