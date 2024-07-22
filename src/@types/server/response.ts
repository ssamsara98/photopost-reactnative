export type SuccessJSON<T> = {
  status: 'success';
  statusCode: number;
  result: T;
};
export type ErrorJSON<E extends Error = any> = {
  status: 'error';
  statusCode: number;
  message: string;
  error: E;
};
