import { Component, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { TextEditorComponent } from './text-editor/text-editor.component'
import { NavbarComponent } from './navbar/navbar.component'
import { HomeComponent } from './pages/home/home.component'
import { NgIf } from '@angular/common'
import { AuthService } from './services/authorisation.service'
import { ToastModule } from 'primeng/toast'
import { AboutUsComponent } from './pages/about-us/about-us.component'
import { FormsModule } from '@angular/forms'
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TextEditorComponent,
    NavbarComponent,
    HomeComponent,
    NgIf,
    ToastModule,
    AboutUsComponent,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'gk-system-cms'
  userAuthorised: boolean = false
  selectorVisible: boolean = false
  showNavbar: boolean = false

  constructor(private authService: AuthService, private http: HttpClient) {
    if (window.location.pathname == '/reset-password') return
    this.userAuthorised = authService.isAuthorized
    if (authService.isAuthorized && window.location.pathname == '/login-page') window.location.href = '/'
    if (!authService.isAuthorized && window.location.pathname != '/login-page') window.location.href = '/login-page'
  }
}
