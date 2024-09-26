import { Routes } from '@angular/router'
import { HomeComponent } from './pages/home/home.component'
import { AboutUsComponent } from './pages/about-us/about-us.component'
import { RealisationsComponent } from './pages/realisations/realisations.component'
import { ContactComponent } from './pages/contact/contact.component'
import { ReferencesComponent } from './pages/references/references.component'
import { GeneralConfigComponent } from './pages/general-config/general-config.component'
import { ForSellComponent } from './pages/for-sell/for-sell.component'
import { LoginPageComponent } from './pages/login-page/login-page.component'
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component'
import { MessagesComponent } from './pages/messages/messages.component'

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'general-config', component: GeneralConfigComponent },
  { path: 'references', component: ReferencesComponent },
  { path: 'realisations', component: RealisationsComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'for-sell', component: ForSellComponent },
  { path: 'login-page', component: LoginPageComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'messages', component: MessagesComponent },
]
