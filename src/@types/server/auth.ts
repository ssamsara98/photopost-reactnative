/* auth */
export type RegisterReq = {
  email: string;
  username: string;
  password: string;
  name: string;
};
export type RegisterRes = {
  type: string;
  token: string;
};

export type LoginReq = {
  userSession: string;
  password: string;
};
export type LoginRes = {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
};

export type Sig = {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
};

export type RefreshTokensReq = {
  refreshToken: string;
};
