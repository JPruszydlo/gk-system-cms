import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Realisation } from '../models/Realisation.model'
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class RealisationsService {
  constructor(private http: HttpClient) {}

  addToFavourite(imageId: number, value: boolean) {
    let apiUrl = environment.apiHostName + 'realisations'
    return new Promise<void>((response, error) => {
      this.http.put(apiUrl + `/favourites/${imageId}?value=${value}`, null).subscribe({
        next: () => response(),
        error: () => error(),
      })
    })
  }
  getRealisations() {
    let apiUrl = environment.apiHostName + 'realisations'
    return new Promise((response) => {
      this.http.get<any>(apiUrl).subscribe({
        next: (resp: any) => {
          response(resp)
        },
      })
    })
  }
  setRealisations(realisations: Realisation[], okCallback: any, errorCallback: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }
    this.http.post(environment.apiHostName + 'realisations', realisations, httpOptions).subscribe({
      next: () => {
        okCallback()
      },
      error: () => {
        errorCallback()
      },
    })
  }
  removeRealisationImage(id: number, okCallback: any, errorCallback: any) {
    this.http.delete(environment.apiHostName + 'realisations/image/' + id).subscribe({
      next: (items: any) => {
        okCallback(items)
      },
      error: () => {
        errorCallback()
      },
    })
  }
  removeRealisation(id: number, okCallback: any, errorCallback: any) {
    this.http.delete(environment.apiHostName + 'realisations/' + id).subscribe({
      next: (items: any) => {
        okCallback(items)
      },
      error: () => {
        errorCallback()
      },
    })
  }
  addRealisations(realisation: Realisation, okCallback: any, errorCallback: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }
    this.http.post(environment.apiHostName + 'realisations', realisation, httpOptions).subscribe({
      next: (newItem: any) => {
        okCallback(newItem)
      },
      error: () => {
        errorCallback()
      },
    })
  }
}
