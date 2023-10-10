type ApiJsonResult<T> = {
  status?: number;
  code: number;
  message: string;
  data: T;
};
