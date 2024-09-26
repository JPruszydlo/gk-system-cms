import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { CarouselItem } from '../models/CarouselItem.model'
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class CarouselService {
  constructor(private http: HttpClient) {}

  getConfig() {
    let url = environment.apiHostName + 'carousel/config'
    return new Promise<CarouselItem[]>((response) => {
      this.http.get<CarouselItem[]>(url).subscribe({
        next: (resp: CarouselItem[]) => {
          response(resp)
        },
      })
    })
  }

  setConfig(config: CarouselItem[] | undefined, okCallback: any, errorCallback: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }
    let url = environment.apiHostName + 'carousel/config'
    this.http.put(url, config, httpOptions).subscribe({
      next: () => {
        okCallback()
      },
      error: () => {
        errorCallback()
      },
    })
  }
}
