import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
import { environment } from '../environments/environment'

type LoginToken = {
  token: string
  expiresInMin: number
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private cookies: CookieService) {}

  get token(): string {
    return this.cookies.get('authorisationToken') ?? ''
  }
  set token(token: LoginToken) {
    let expired = new Date()
    expired.setMinutes(expired.getMinutes() + token.expiresInMin)
    this.cookies.set('authorisationToken', token.token, expired)
  }
  get isAuthorized(): boolean {
    return this.cookies.check('authorisationToken')
  }

  logout() {
    this.cookies.delete('authorisationToken')
  }

  authorizeUser(login: string, password: string, okCallback: any, errorCallback: any) {
    var header = {
      headers: new HttpHeaders().set('Authorization', `Basic ${btoa(`${login}:${password}`)}`),
    }
    this.http.post<LoginToken>(environment.apiHostName + 'home/login', '', header).subscribe({
      next: (token: LoginToken) => {
        this.token = token
        okCallback()
      },
      error: () => errorCallback(),
    })
  }
  resetPassword(login: string, email: string, okCallback: any, errorCallback: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }
    let url = environment.apiHostName + 'home/reset-pass-request'
    let resetModel = { username: login, email: email }
    this.http.post(url, resetModel, httpOptions).subscribe({
      next: () => okCallback(),
      error: () => errorCallback(),
    })
  }
  setNewPassword(login: string, password: string, token: string, okCallback: any, errorCallback: any) {
    var header = {
      headers: new HttpHeaders().set('Authorization', `Basic ${btoa(`${login}:${password}`)}`),
    }
    let url = environment.apiHostName + 'home/set-password?token=' + token
    this.http.post(url, '', header).subscribe({
      next: () => okCallback(),
      error: (error) => errorCallback(error),
    })
  }
}
