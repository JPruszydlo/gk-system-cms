import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PasswordModule } from 'primeng/password'
import { AuthService } from '../../services/authorisation.service'
import { MessageService } from '../../services/customMessage.service'
import { HttpErrorResponse } from '@angular/common/http'

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, PasswordModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  loginValue: string = ''
  passwordValue: string = ''
  password2Value: string = ''
  token: string = ''
  constructor(private authService: AuthService, private messageService: MessageService) {
    this.token = window.location.search.replace('?token=', '')
  }
  setNewPassword() {
    if (this.passwordValue != this.password2Value) {
      this.messageService.sendCustomMessage('error', '', 'Podane hasła nie są takie same', 'text-lg bg-red-100', 4000)
      return
    }
    this.authService.setNewPassword(
      this.loginValue,
      this.passwordValue,
      this.token,
      () => {
        setTimeout(() => {
          window.location.href = '/login-page'
        }, 4000)
        this.messageService.sendCustomMessage(
          'success',
          '',
          'Hasło zostało zapisane. Za chwię nastąpi przekierowanie na stronę logowania',
          'text-lg bg-green-100',
          4000
        )
      },
      (error: HttpErrorResponse) => {
        if (error.status == 400) {
          window.location.href = '/'
          return
        }
        this.messageService.sendCustomMessage(
          'error',
          '',
          error.error ?? 'Nie można w tej chwili ustawić hasła',
          'text-lg bg-red-100',
          5000
        )
      }
    )
  }
}
