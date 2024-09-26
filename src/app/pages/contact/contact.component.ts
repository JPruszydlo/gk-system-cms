import { Component, OnInit } from '@angular/core'
import { ApiService } from '../../services/api.service'
import { ConfigItem } from '../../models/ConfigItem.model'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MessageService } from '../../services/customMessage.service'
import { FloatLabelModule } from 'primeng/floatlabel'

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FloatLabelModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup = new FormGroup({
    ceoName: new FormControl(),
    companyName: new FormControl(),
    postCode: new FormControl(),
    city: new FormControl(),
    district: new FormControl(),
    street: new FormControl(),
    houseNumber: new FormControl(),
    flatNumber: new FormControl(),
    phone: new FormControl(),
    email: new FormControl(),
  })
  test: string | undefined
  constructor(private apiService: ApiService, private messageService: MessageService) {}
  ngOnInit(): void {
    this.apiService.getGeneralConfig().then((result: any) => {
      this.contactForm.controls['ceoName'].setValue(result['ceoName'].value)
      this.contactForm.controls['companyName'].setValue(result['companyName'].value)
      this.contactForm.controls['postCode'].setValue(result['postCode'].value)
      this.contactForm.controls['city'].setValue(result['city'].value)
      this.contactForm.controls['district'].setValue(result['district'].value)
      this.contactForm.controls['street'].setValue(result['street'].value)
      this.contactForm.controls['houseNumber'].setValue(result['houseNumber'].value)
      this.contactForm.controls['flatNumber'].setValue(result['flatNumber'].value)
      this.contactForm.controls['phone'].setValue(result['phone'].value)
      this.contactForm.controls['email'].setValue(result['email'].value)
    })
  }

  submit() {
    let configs: ConfigItem[] = []
    Object.keys(this.contactForm.value).forEach((name: string) => {
      configs.push({ name: name, value: this.contactForm.value[name] })
    })
    this.apiService.setGeneralConfig(
      configs,
      () => this.messageService.sendSaveSuccess(),
      () => this.messageService.sendSaveFailed()
    )
  }
}
