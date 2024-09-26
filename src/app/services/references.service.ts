import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Reference } from '../models/Reference.model'
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class ReferencesService {
  constructor(private http: HttpClient) {}

  getReferences() {
    let apiUrl = environment.apiHostName + 'references'
    return new Promise((response) => {
      this.http.get<any>(apiUrl).subscribe({
        next: (resp: any) => {
          response(resp)
        },
      })
    })
  }
  setReferences(reference: Reference, okCallback: any, errorCallback: any) {
    if (reference == null) return reference
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }
    this.http.post(environment.apiHostName + 'references', reference, httpOptions).subscribe({
      next: () => {
        okCallback()
      },
      error: () => {
        errorCallback()
      },
    })
  }
  deleteReference(id: number) {
    let apiUrl = environment.apiHostName + 'references/' + id
    return new Promise((response) => {
      this.http.delete<any>(apiUrl).subscribe({
        next: (resp: any) => {
          response(resp)
        },
      })
    })
  }
}
