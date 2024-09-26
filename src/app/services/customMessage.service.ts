import { Injectable } from '@angular/core'
import * as prime from 'primeng/api'

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private messageService: prime.MessageService) {}

  sendSaveSuccess(life: number = 2000) {
    this.messageService.add({
      severity: 'success',
      summary: 'Sukces!',
      detail: 'Zapisano zmiany',
      life: life,
    })
  }
  sendSaveFailed(life: number = 2000) {
    this.messageService.add({
      severity: 'error',
      summary: 'Błąd!',
      detail: 'Zmiany nie zostały zapisane',
      life: life,
    })
  }
  sendCustomMessage(severity: string, summary: string, detail: string, styleClass: string = '', life: number = 2000) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      life: life,
      contentStyleClass: styleClass,
    })
  }
}
