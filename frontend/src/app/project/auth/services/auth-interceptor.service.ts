import { UtilService } from './../../core/services/util.service';
import { HttpProgressState, HttpStateService, IHttpState } from './../../core/services/http-state.service';
import { StatsMockService } from './../../core/services/mock/stats-mock.service';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  private exceptions: string[] = [
    'auth/signin'
  ];

  constructor(private auth: AuthService,
              private statMock: StatsMockService,
              private httpState: HttpStateService,
              private utils: UtilService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (this.auth.isAuth()) {
      const token = this.auth.getAuth().token;
      request = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token)
      });
      // Mock for stats
      /* if (request.url.includes('statistiques/')) {
        return this.statMock.route(request);
      } */
    }

    // Les requêtes qui ne sont pas incluses dans le controle
    if (!this.exceptions.every(term => request.url.indexOf(term) === -1)) {
      return next.handle(request);
    }

    // Mise en place du state de la requete
    const state: IHttpState = {
      url: request.url,
      state: HttpProgressState.start,
      isError: false
    }
    this.httpState.state.next(state);

    return next.handle(request).pipe(
      catchError(error => {
        state.isError = request.method === 'GET';
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.utils.disconnectSwal().then(() => {
            this.auth.logout();
          })
        }
        throw throwError(error)
      }),
      finalize(() => {
        state.state = HttpProgressState.end;
        this.httpState.state.next(state)
      })
    );
  }
}
