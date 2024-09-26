import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigItem } from '../models/ConfigItem.model'
import { environment } from '../environments/environment'
import { EmailModel } from '../models/Email.model'

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getGeneralConfig() {
    let apiUrl = environment.apiHostName + `home/generalconfig?configGroup=-1`
    return new Promise((response) => {
      this.http.get<any>(apiUrl).subscribe({
        next: (resp: any) => {
          response(resp)
        },
      })
    })
  }

  getHomePageConfig() {
    let apiUrl = environment.apiHostName + `home/home-config`
    return new Promise((response) => {
      this.http.get<any>(apiUrl).subscribe({
        next: (resp: any) => {
          response(resp)
        },
      })
    })
  }
  getVisitors() {
    let apiUrl = environment.apiHostName + `home/visitors`
    return new Promise((response) => {
      this.http.get<any>(apiUrl).subscribe({
        next: (resp: any) => {
          response(resp)
        },
      })
    })
  }
  setGeneralConfig(configs: ConfigItem[], okCallback: any, errorCallback: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }
    let apiUrl = environment.apiHostName + 'home/setgeneralconfig'
    this.http.post(apiUrl, configs, httpOptions).subscribe({
      next: () => {
        okCallback()
      },
      error: () => {
        errorCallback()
      },
    })
  }
  getEmails() {
    let url = environment.apiHostName + 'email'

    return new Promise<EmailModel[]>((response) => {
      this.http.get<EmailModel[]>(url).subscribe({
        next: (resp: EmailModel[]) => {
          response(resp)
        },
      })
    })
  }

  removeEmails(ids: number[]) {
    let url = environment.apiHostName + 'email?ids=' + ids.join(',')

    var header = {
      headers: new HttpHeaders().set('Authorization', `Basic ${btoa(`${environment.apiUser}:${environment.apiKey}`)}`),
    }
    return new Promise((response, error) => {
      this.http.delete(url, header).subscribe({
        next: (resp) => response(resp),
        error: () => error(),
      })
    })
  }
}
