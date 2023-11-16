export interface UserPayload {
  id: number;
  sub: number;
  email: string;
  name: string;
  role: string;
  iat?: number;
  exp?: number;
}
