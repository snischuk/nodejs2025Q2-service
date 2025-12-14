import type { JwtPayload } from 'jsonwebtoken';

export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload extends JwtPayload {
  userId: string;
  login: string;
}
