export class AuthResponse {
  username: string;
  token: string;
  role?: string | null;
  authorities: {authority: string}[];
}
