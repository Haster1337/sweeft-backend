import { Token } from '../token.model';

export interface Tokens {
  accessToken: string;
  refreshToken: Token;
}

export interface Payload {
  id: number;
  email: string;
  type: string;
}
