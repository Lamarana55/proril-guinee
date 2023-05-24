import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/auth-response.model';
import { ResetPassword } from '../models/reset-passwor.model';

const API_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  isAuth(): boolean {
    const auth = this.getAuth();
    return !!auth && Object.keys(auth).length !== 0;
  }

  getAuth(): AuthResponse {
    return <AuthResponse>JSON.parse(sessionStorage.getItem(environment.userConnectedKey))
  }

  setAuth(auth: AuthResponse) {
    sessionStorage.setItem(environment.userConnectedKey, JSON.stringify(auth))
  }

  login(loginRequest: {telephone: string, password: string}): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(API_URL + 'auth/signin', loginRequest);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  getPermissions(): string {
    return this.getAuth().authorities.map(role => role.authority).join(',');
  }
  // =============================== Change password =============================== //
  // send mail for changing password 

  sendEmail(email: string): Observable<any> {
    return this.http.get( API_URL + 'auth/send-email?email=' + email)
  }

  updatePassword(request: ResetPassword): Observable<any> {
    return this.http.post(API_URL +  'auth/reset-password', request);
  }
}
