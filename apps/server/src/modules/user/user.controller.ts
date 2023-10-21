import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserReqDto } from './dto/create-user.dto';

@Controller('user')
@ApiTags('User')
@ApiBadRequestResponse({ description: '参数错误' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiCreatedResponse({ description: '创建用户成功' })
  createUser(@Body() body: CreateUserReqDto) {
    this.userService.createUserByEmail(
      body.email,
      body.password,
      body.nickName,
    );
  }
}
