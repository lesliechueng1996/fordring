type ApiJsonResult<T> = {
  code: number;
  message: string;
  data: T;
};
