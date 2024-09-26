import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PasswordModule } from 'primeng/password'
import { AuthService } from '../../services/authorisation.service'
import { MessageService } from '../../services/customMessage.service'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, PasswordModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  loginValue: string = ''
  passwordValue: string = ''
  resetLoginValue: string = ''
  resetEmailValue: string = ''
  constructor(private http: HttpClient, private authService: AuthService, private messageService: MessageService) {}

  resetPassword() {
    this.authService.resetPassword(
      this.resetLoginValue,
      this.resetEmailValue,
      () =>
        this.messageService.sendCustomMessage(
          'success',
          '',
          'Na podany adres e-mail wysłaliśmy instrukcje resetowania hasła',
          'text-lg bg-green-100',
          8000
        ),
      () =>
        this.messageService.sendCustomMessage(
          'error',
          'Wystąpił błąd',
          'Nie możemy w tej chwili zresetować hasła',
          'text-lg bg-red-100',
          5000
        )
    )
  }
  authorizeUser() {
    this.authService.authorizeUser(
      this.loginValue,
      this.passwordValue,
      (token: string) => this.userAuthorized(),
      () => this.messageService.sendCustomMessage('error', 'Błąd', 'Błędna nazwa użytkownika lub hasło')
    )
  }

  private userAuthorized() {
    window.location.href = '/'
  }
}
