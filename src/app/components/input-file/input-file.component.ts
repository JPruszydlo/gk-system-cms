import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core'
import { NgIf } from '@angular/common'
import { FileUploadService } from '../../services/fileUpload.service'
import { Image } from '../../models/ImageModel'

@Component({
  selector: 'app-input-file',
  standalone: true,
  imports: [NgIf],
  templateUrl: './input-file.component.html',
  styleUrl: './input-file.component.css',
})
export class InputFileComponent implements OnInit {
  @Output() inputChange: EventEmitter<string> = new EventEmitter<string>()
  @Output() inputChange2: EventEmitter<Image> = new EventEmitter<Image>()
  @Input() styleClass: string = ''
  @Input() divStyleClass: string = ''
  @Input() visible: boolean = false
  @Input() icon: string = 'pi-file-edit'
  @Input() staticVisible: boolean | undefined
  defaultClass: string = 'absolute top-0 left-0 bg-black w-full h-full'
  constructor(private uploadService: FileUploadService) {}

  ngOnInit(): void {
    if (this.staticVisible) this.visible = true

    if (this.divStyleClass.indexOf('bg-opacity') == -1) this.defaultClass += ' bg-opacity-50'
  }
  fileInputChange(event: any) {
    let file = event.target.files[0]
    this.uploadService.inputChanged(file, (result: string) => {
      this.inputChange.emit(result)

      let image: Image = {
        base64: result,
        filename: file.name,
        file: file,
      }
      this.inputChange2.emit(image)
      if (!this.staticVisible) this.visible = false
    })
  }
}
