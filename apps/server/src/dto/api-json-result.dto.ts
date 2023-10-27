import { IApiJsonResult } from '@fordring/api-type';
import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import {
  ApiDefaultResponse,
  ApiExtraModels,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { SUCCESS } from 'src/constants/error.const';

export class ApiJsonResult<T> implements IApiJsonResult<T> {
  @ApiProperty({ description: '状态码' })
  code: number;

  @ApiProperty({ description: '提示信息' })
  message: string;

  data: T;

  @ApiProperty({ description: '状态码' })
  status: number;

  constructor(code: number, message: string, data: T, status?: number) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.status = status;
  }

  static success<T>(data: T, status = HttpStatus.OK) {
    return new ApiJsonResult(SUCCESS, 'success', data, status);
  }

  static error<T>(
    code: number,
    message: string,
    data: T = null,
    status = HttpStatus.INTERNAL_SERVER_ERROR
  ) {
    return new ApiJsonResult(code, message, data, status);
  }
}

export const ApiJsonResultResponse = <TModel extends Type<unknown>>(
  model: TModel
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiDefaultResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiJsonResult) },
          {
            properties: {
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    })
  );
};
