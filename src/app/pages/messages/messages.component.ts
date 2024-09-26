import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core'
import { ApiService } from '../../services/api.service'
import { EmailModel } from '../../models/Email.model'
import { CommonModule } from '@angular/common'
import { AccordionModule } from 'primeng/accordion'
import { response } from 'express'
import { MessageService } from '../../services/customMessage.service'
import { tick } from '@angular/core/testing'
import { timeStamp } from 'console'
import { PaginatorModule } from 'primeng/paginator'
import { DropdownModule } from 'primeng/dropdown'

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, AccordionModule, PaginatorModule, DropdownModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
  @ViewChildren('selectItem') selectItems: QueryList<ElementRef<HTMLInputElement>>
  constructor(private apiService: ApiService, private toast: MessageService) {}
  emails: EmailModel[] = []
  buttonText = 'Zaznacz'
  removeButtonClass = 'disabled'
  emailsPart: EmailModel[] = []
  activeIdx: number = -1
  selectAllSelected: boolean = false
  perPage: number = 10
  page: number = 0
  start: number = this.page * this.perPage
  end: number = this.start + this.perPage
  inputChange(e: any) {
    this.perPage = parseInt(e.target.value)
    this.changePage(0)
  }
  changePage(num: number) {
    this.page += num
    this.start = this.page * this.perPage
    this.end = this.start + this.perPage
    if (this.emails.slice(this.start, this.end).length == 0) {
      this.page -= num
      this.start = this.page * this.perPage
      this.end = this.start + this.perPage
      return
    }
    this.deselectAll()
    this.activeIdx = -1
    this.emailsPart = this.emails.slice(this.start, this.end)
  }
  ngOnInit(): void {
    this.apiService.getEmails().then((result: EmailModel[]) => {
      this.emails = result.sort((a: EmailModel, b: EmailModel) => b.sendAt - a.sendAt)

      this.emailsPart = structuredClone(this.emails.slice(this.start, this.end))
    })
  }
  getDate(ticks: number) {
    let epochTicks = 621355968000000000
    let dt = new Date((ticks - epochTicks) / 10000)
    return `
      ${dt.getUTCDate().toString().padStart(2, '0')}.${(dt.getMonth() + 1)
      .toString()
      .padStart(2, '0')}.${dt.getUTCFullYear()}
      ${dt.getUTCHours().toString().padStart(2, '0')}:${dt.getUTCMinutes().toString().padStart(2, '0')}
      `
  }
  toggleSelectAll(checked: boolean) {
    if (checked) {
      this.removeButtonClass = ''
    } else {
      this.removeButtonClass = 'disabled'
    }
    this.selectItems.toArray().forEach((x) => {
      x.nativeElement.checked = checked
    })
  }
  deselectAll() {
    this.buttonText = 'Zaznacz'
    this.removeButtonClass = 'disabled'

    this.selectItems.toArray().forEach((x) => {
      x.nativeElement.checked = false
    })
  }
  removeSelected() {
    if (!confirm('Na pewno chcesz usunąć zaznaczone wiadomości?')) return
    let selected = this.selectItems
      .toArray()
      .filter((x) => x.nativeElement.checked)
      .map((x) => parseInt(x.nativeElement.value))
    this.apiService.removeEmails(selected).then(
      (response: any) => {
        this.emails = response.sort((a: EmailModel, b: EmailModel) => b.sendAt - a.sendAt)
        this.toast.sendSaveSuccess()
      },
      () => {
        this.toast.sendSaveFailed()
      }
    )
  }
  selectionChange() {
    let isAnySelected = false
    this.selectItems.toArray().forEach((x) => {
      if (x.nativeElement.checked) {
        isAnySelected = true
        return
      }
    })
    if (isAnySelected) this.removeButtonClass = ''
    else this.removeButtonClass = 'disabled'
  }
}
