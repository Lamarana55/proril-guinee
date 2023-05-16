export class AuthResponse {
  username: string;
  token: string;
  authorities: {authority: string}[];
}
