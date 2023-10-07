import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiDefaultResponse,
  ApiExtraModels,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { SUCCESS } from 'src/constants/error.const';

export class ApiJsonResult<T> {
  @ApiProperty({ description: '状态码' })
  code: number;

  @ApiProperty({ description: '提示信息' })
  message: string;

  data: T;

  constructor(code: number, message: string, data: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static success<T>(data: T) {
    return new ApiJsonResult(SUCCESS, 'success', data);
  }

  static error<T>(code: number, message: string, data: T = null) {
    return new ApiJsonResult(code, message, data);
  }
}

export const ApiJsonResultResponse = <TModel extends Type<any>>(
  model: TModel,
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
    }),
  );
};
