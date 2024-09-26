import { Component, OnInit } from '@angular/core'
import { TabViewModule } from 'primeng/tabview'
import { TextEditorComponent } from '../../text-editor/text-editor.component'
import { ImageModule } from 'primeng/image'
import { FileUploadModule } from 'primeng/fileupload'
import { CommonModule } from '@angular/common'
import { SelectButtonModule } from 'primeng/selectbutton'
import { FormsModule } from '@angular/forms'
import { BannerConfigComponent } from '../../components/banner-config/banner-config.component'
import { PanelConfig } from '../../models/PanelConfig.model'
import { ApiService } from '../../services/api.service'
import { MessageService } from '../../services/customMessage.service'
import { InputFileComponent } from '../../components/input-file/input-file.component'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { CarouselItem } from '../../models/CarouselItem.model'
import { FileUploadService } from '../../services/fileUpload.service'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TabViewModule,
    TextEditorComponent,
    ImageModule,
    FileUploadModule,
    CommonModule,
    SelectButtonModule,
    FormsModule,
    BannerConfigComponent,
    InputFileComponent,
    ProgressSpinnerModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  panelsConfig: PanelConfig[] = [
    { panelName: '"O firmie"', visible: true },
    { panelName: '"Ostatnie realizacje"', visible: true },
    { panelName: '"Dlaczego my?"', visible: true },
    { panelName: '"Referencje"', visible: true },
  ]
  selectedBannerType: string = 'carousel'

  mainPageDescription: string = ''
  editorResult: string = ''
  uploadedFiles: any[] = []
  availableImages: string[] = []
  mainPageDescImage: string = ''
  dataReady: boolean = false
  carouselConfig: CarouselItem[] = []
  dataSaved: boolean = true
  constructor(
    private messageService: MessageService,
    private apiService: ApiService,
    private uploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.apiService.getHomePageConfig().then((result: any) => {
      this.carouselConfig = result[1]
      this.mainPageDescription = result[0]['aboutUsShort'].value
      this.editorResult = structuredClone(this.mainPageDescription)
      this.mainPageDescImage = result[0]['aboutUsShortImage'].value + '?' + Date.now()
      this.dataReady = true
    })
  }
  saveAboutUsShort(image: HTMLImageElement) {
    this.dataSaved = false

    let fileToUpload = [[image.alt.split('?')[0], image.src.split('base64,')[1]]]

    this.uploadService.uploadFile2(fileToUpload, (result: any) => {
      this.apiService.setGeneralConfig(
        [
          { name: 'aboutUsShort', value: this.editorResult },
          { name: 'aboutUsShortImage', value: result[0][0] },
        ],
        () => {
          this.dataSaved = true
          this.messageService.sendSaveSuccess()
        },
        () => {
          this.dataSaved = true
          this.messageService.sendSaveFailed()
        }
      )
    })
  }
}
