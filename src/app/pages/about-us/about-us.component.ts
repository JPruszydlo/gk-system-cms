import { Component, OnInit } from '@angular/core'
import { TextEditorComponent } from '../../text-editor/text-editor.component'
import { ApiService } from '../../services/api.service'
import { MessageService } from '../../services/customMessage.service'

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [TextEditorComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
})
export class AboutUsComponent implements OnInit {
  longDescription: string = ''
  editorResult: string = ''

  constructor(private apiService: ApiService, private messageService: MessageService) {}
  ngOnInit(): void {
    this.apiService.getGeneralConfig().then((result: any) => {
      this.longDescription = result['aboutUsLong'].value
    })
  }

  saveChanges() {
    this.apiService.setGeneralConfig(
      [{ name: 'aboutUsLong', value: this.editorResult }],
      () => this.messageService.sendSaveSuccess(),
      () => this.messageService.sendSaveFailed()
    )
  }
}
