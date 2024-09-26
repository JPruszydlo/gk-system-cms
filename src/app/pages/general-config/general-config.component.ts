import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ApiService } from '../../services/api.service'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { MessageService } from '../../services/customMessage.service'
import { HttpClient } from '@angular/common/http'
import { AccordionModule } from 'primeng/accordion'

@Component({
  selector: 'app-general-config',
  standalone: true,
  imports: [FormsModule, CommonModule, AccordionModule],
  templateUrl: './general-config.component.html',
  styleUrl: './general-config.component.css',
})
export class GeneralConfigComponent implements OnInit {
  privatePolicyText: string = ''
  mapTag: SafeResourceUrl = ''
  topLocalisations: any
  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    private http: HttpClient
  ) {
    this.apiService.getGeneralConfig().then((result: any) => {
      this.mapTag = this.getMapTag(result['googleTag'].value)
      this.privatePolicyText = result['privatePolicyCheckbox'].value
    })
    this.apiService.getEmails()
  }
  getCode(localisation: string) {
    let result = localisation.substring(localisation.indexOf(',') + 2, localisation.indexOf(':'))
    return result.toLocaleLowerCase()
  }
  ngOnInit(): void {
    this.apiService.getVisitors().then((result: any) => {
      this.topLocalisations = result
    })
  }
  savePrivatePolicy(text: string) {
    this.apiService.setGeneralConfig(
      [{ name: 'privatePolicyCheckbox', value: text }],
      () => this.messageService.sendSaveSuccess(),
      () => this.messageService.sendSaveFailed()
    )
  }
  getMapTag(iframeString: string) {
    if (iframeString == undefined) return this.sanitizer.bypassSecurityTrustResourceUrl('')
    let tagsrc = new DOMParser().parseFromString(iframeString, 'text/html').getElementsByTagName('iframe')[0].src
    return this.sanitizer.bypassSecurityTrustResourceUrl(tagsrc)
  }

  saveGoogleTag(iframe: string) {
    this.apiService.setGeneralConfig(
      [{ name: 'googleTag', value: iframe }],
      () => this.messageService.sendSaveSuccess(),
      () => this.messageService.sendSaveFailed()
    )
  }
  parseGoogleTag(tag: string): string {
    let iFrame = new DOMParser().parseFromString(tag, 'text/html').body.firstElementChild

    if (iFrame == undefined) return ''

    if (iFrame.parentElement == undefined) return ''
    iFrame.parentElement.getElementsByTagName('iframe')[0].style.width = '100%'
    iFrame.parentElement.getElementsByTagName('iframe')[0].style.height = '300px'
    return iFrame.outerHTML
  }
}
