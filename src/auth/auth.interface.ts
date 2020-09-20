export interface ILoginRequestPayload {
  account: string;
  otp: boolean;
}

export interface ILoginRequest {
  guid: string;
  tempId: string;
}

export interface ILoginVerifyPayload {
  guid: string;
  tempId: string;
  account: string;
  code: string;
  otp: boolean;
}

export interface ILoginVerify {
  token: string;
}
