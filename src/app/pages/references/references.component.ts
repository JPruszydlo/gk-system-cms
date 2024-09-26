import { CommonModule } from '@angular/common'
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { SelectButton, SelectButtonModule } from 'primeng/selectbutton'
import { Reference } from '../../models/Reference.model'
import { ReferencesService } from '../../services/references.service'
import { MessageService } from '../../services/customMessage.service'
import { InputFileComponent } from '../../components/input-file/input-file.component'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { environment } from '../../environments/environment'
import { FileUploadService } from '../../services/fileUpload.service'

@Component({
  selector: 'app-references',
  standalone: true,
  imports: [SelectButtonModule, CommonModule, FormsModule, InputFileComponent, ProgressSpinnerModule],
  templateUrl: './references.component.html',
  styleUrl: './references.component.css',
})
export class ReferencesComponent implements OnInit {
  assetsUrl: string = environment.assetsUrl
  dataSaved: boolean = true
  stateOptions: any[] = [
    { label: 'Zdjęcie', value: 'image' },
    { label: 'Tekst', value: 'text' },
  ]
  references: Reference[] = []
  referencesOrigin: Reference[] = []
  @ViewChildren('saveButton') saveButtons: QueryList<ElementRef<HTMLButtonElement>>
  constructor(
    private referencesService: ReferencesService,
    private messageService: MessageService,
    private fileUpload: FileUploadService
  ) {}

  saveChanges(refIdx: number, img: HTMLImageElement, refTypeSelect: SelectButton) {
    let fileToUpload = refTypeSelect.value == 'image' ? [[img.alt.split('?')[0], img.src.split('base64,')[1]]] : null
    this.fileUpload.uploadFile2(fileToUpload, (response: any) => {
      let ref = structuredClone(this.references[refIdx])
      ref.image = refTypeSelect.value == 'image' ? response[0][0] : null
      ref.text = refTypeSelect.value == 'text' ? this.references[refIdx].text : ''

      this.referencesService.setReferences(
        ref,
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
  inputChanged(event: any, index: number) {
    this.references[index].customerName = event.target.value
  }
  textAreaChanged(event: any, idx: number) {
    this.references[idx].text = event.target.value
  }
  imageChanged(src: string, idx: number) {
    this.references[idx].image = src
  }
  removeReference(idx: number) {
    if (!confirm('Na pewno chcesz usunąć referencję?')) return
    this.referencesService.deleteReference(this.references[idx].id).then(
      () => {
        this.messageService.sendSaveSuccess(), this.references.splice(idx, 1)
      },
      () => this.messageService.sendSaveFailed()
    )
  }
  ngOnInit(): void {
    this.referencesService.getReferences().then((result: any) => {
      result = result.map((x: any) => {
        return {
          image: x.image == '' ? null : x.image + '?' + Date.now(),
          text: x.text,
          customerName: x.customerName,
          id: x.id,
        }
      })
      this.referencesOrigin = structuredClone(result)
      this.references = result
    })
  }
}
