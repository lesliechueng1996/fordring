import { SUCCESS } from 'src/constants/error.const';

export class ApiJsonResult {
  code: number;
  message: string;
  data: any;

  constructor(code: number, message: string, data: any) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static success(data) {
    return new ApiJsonResult(SUCCESS, 'success', data);
  }

  static error(code: number, message: string, data: any = null) {
    return new ApiJsonResult(code, message, data);
  }
}
