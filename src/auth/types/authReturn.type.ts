export type RegisterReturnType = {
  accessToken: string;
  refreshToken: string;
};

export type LoginReturnType = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshReturnType = {
  accessToken: string;
};

export type LogoutReturnType = {
  message: string;
};
