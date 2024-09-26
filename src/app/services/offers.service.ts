import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Offer } from '../models/Offer.model'
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class OffersService {
  constructor(private http: HttpClient) {}

  setAvailableState(offerId: number, state: boolean) {
    let apiUrl = environment.apiHostName + 'offers/state/' + offerId + '?value=' + state

    return new Promise<void>((response, error) => {
      this.http.put(apiUrl, null).subscribe({
        next: () => response(),
        error: () => error(),
      })
    })
  }
  getOffers() {
    let apiUrl = environment.apiHostName + 'offers'
    return new Promise<Offer[]>((response) => {
      this.http.get<Offer[]>(apiUrl).subscribe({
        next: (resp: Offer[]) => {
          response(resp)
        },
      })
    })
  }

  addOffer(offer: Offer, okCallback: any, errorCallback: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }
    offer.createAt = new Date().getTime()
    this.http.post(environment.apiHostName + 'offers', offer, httpOptions).subscribe({
      next: (offers: any) => {
        okCallback(offers)
      },
      error: () => {
        errorCallback()
      },
    })
  }

  updateOffer(offer: Offer, offerId: number, okCallback: any, errorCallback: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }
    this.http.put(`${environment.apiHostName}offers/${offerId}`, offer, httpOptions).subscribe({
      next: (offers: any) => {
        okCallback(offers)
      },
      error: () => {
        errorCallback()
      },
    })
  }

  deleteOffer(offerId: number, okCallback: any, errorCallback: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }
    this.http.delete(`${environment.apiHostName}offers/${offerId}`).subscribe({
      next: (offers: any) => {
        okCallback(offers)
      },
      error: () => {
        errorCallback()
      },
    })
  }
}
