export interface IBaseResponse<T = any> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}
