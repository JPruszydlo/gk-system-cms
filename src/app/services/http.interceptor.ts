import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { AuthService } from './authorisation.service'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let authService = inject(AuthService)

  if (req.url.includes('home/login')) return next(req)
  if (req.url.includes('external/')) return next(req)

  let modifiedReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${authService.token}`),
  })
  return next(modifiedReq)
}
