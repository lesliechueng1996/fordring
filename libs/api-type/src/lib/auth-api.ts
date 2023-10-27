export interface GenerateTokenReq {
  email: string;
  password: string;
}

export interface GenerateTokenRes {
  accessToken: string;
  refreshToken: string;
}
