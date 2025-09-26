import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AuthStore } from '../../application/state/auth.store';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const token = authStore.getToken();
  
  // Agregar token a todas las peticiones al backend
  if (token && req.url.startsWith(environment.backendUrl)) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }
  
  return next(req);
};

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authStore: AuthStore) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authStore.getToken();
    
    // Agregar token a todas las peticiones al backend
    if (token && req.url.startsWith(environment.backendUrl)) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    }
    
    return next.handle(req);
  }
}