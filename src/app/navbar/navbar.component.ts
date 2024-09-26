import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { ToggleButtonModule } from 'primeng/togglebutton'
import { FormsModule } from '@angular/forms'
import { ApiService } from '../services/api.service'
import { MessageService } from '../services/customMessage.service'
import { AuthService } from '../services/authorisation.service'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ToggleButtonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  menuVisible: boolean = false
  toggleState: string = 'none'
  previewVisible: boolean = false
  technicalBreakSet: boolean = false
  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    apiService.getGeneralConfig().then((result: any) => {
      this.technicalBreakSet = result['isTechnicalBreak'].value == '1' ? true : false
      this.toggleState = ''
    })
  }
  logout() {
    this.authService.logout()
    window.location.reload()
  }
  toggleTechnicalBreak() {
    let value = this.technicalBreakSet ? '1' : '0'
    this.apiService.setGeneralConfig(
      [{ name: 'isTechnicalBreak', value: value }],
      () => {
        if (this.technicalBreakSet)
          this.messageService.sendCustomMessage('success', 'Przerwa techniczna', 'Ustawiono przerwę techniczną')
        else this.messageService.sendCustomMessage('error', 'Przerwa techniczna', 'Wyłączono przerwę techniczną')
        this.toggleState = ''
      },
      () => {
        this.toggleState = 'none'
      }
    )
  }

  resolveActiveElement(elementName: string): string {
    let currentPath = window.location.pathname.substring(1)
    if (currentPath == elementName) return 'active'
    return ''
  }
}
