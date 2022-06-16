export type UserPayload = Omit<User, 'passwordHash'>;

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserJWTPayload {
  email: string;
  sub: number;
  iat: number;
  exp: number;
}
