import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ApiService } from '../../services/api.service'
import { DirElementInfo } from '../../models/DirElementInfo.model'
import { NgOptimizedImage } from '@angular/common'
import { MessageService } from '../../services/customMessage.service'
import { environment } from '../../environments/environment'
import { Subject } from 'rxjs'
import { FileUploadService } from '../../services/fileUpload.service'

@Component({
  selector: 'app-image-selector',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './image-selector.component.html',
  styleUrl: './image-selector.component.css',
})
export class ImageSelectorComponent implements OnInit {
  @Input() componentVisible: boolean = false
  @Input() enableSelection: boolean = true
  @Output() itemSelected: EventEmitter<string> = new EventEmitter<string>()
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>()
  serverElements: DirElementInfo[] = []
  cursorType: string = 'pointer'
  uiElements: DirElementInfo[] = []
  currentDir: string | undefined
  assetsUrl: string = environment.assetsUrl

  fileList: Subject<DirElementInfo> = new Subject<DirElementInfo>()

  constructor(
    private apiService: ApiService,
    private fileUploadService: FileUploadService,
    private messageService: MessageService
  ) {}
  closeSelector() {
    this.componentVisible = false
    this.onClose.emit()
    this.uiElements = structuredClone(this.serverElements)
  }
  ngOnInit(): void {
    if (!this.enableSelection) this.cursorType = 'default'
    this.fileUploadService.getAvailabelImages().then((files) => {
      this.serverElements = files
      this.uiElements = structuredClone(this.serverElements)
    })
  }

  onFileInputChange(event: any) {
    let file = event.target.files[0]
    if (this.uiElements.filter((x) => x.isFile).find((x) => x.name == file.name) != undefined) {
      this.messageService.sendCustomMessage('error', '', 'Plik o podanej nazwie już istnieje', '', 4000)
      return
    }
    if (file) {
      this.fileUploadService.uploadFile(
        file,
        this.currentDir,
        (files: any) => {
          this.messageService.sendCustomMessage('success', '', 'Załadowano plik na serwer', '', 4000)
          this.setUiElements(files)
        },
        () => {
          this.messageService.sendCustomMessage('error', '', 'Nie można w tej chwili załadować pliku', '', 4000)
        }
      )
    }
  }
  resolveIcon(type: string) {
    if (type.indexOf('pdf') >= 0) return 'pdf.svg'
    if (type.indexOf('excel') >= 0) return 'excel.svg'
    if (type.indexOf('word') >= 0) return 'word.svg'
    if (type.indexOf('zip') >= 0) return 'zip.svg'
    return 'file.svg'
  }
  onItemSelected(src: string) {
    if (!this.enableSelection) return
    this.componentVisible = false
    let img = src.substring(src.indexOf('assets/images'))
    img = img.replace('assets/images/', '')
    this.uiElements = structuredClone(this.serverElements)

    this.itemSelected.emit(img)
  }
  currentElementIdx: number = -1
  goTo(idx: number, folderName: string | undefined) {
    this.currentDir = folderName
    this.currentElementIdx = idx
    if (idx == -1) {
      this.uiElements = this.serverElements
      return
    }
    this.uiElements = this.serverElements[idx].files
  }
  removeElement(idx: number) {
    let message = 'Czy na pewno chcesz usunąć ten element?'
    if (this.currentElementIdx == -1) {
      if (!this.serverElements[idx].isFile && this.serverElements[idx].files.length > 0)
        message = 'Katalog nie jest pusty!\n' + message
    }
    if (!confirm(message)) return

    let dirToRemove = ''
    if (this.currentElementIdx > -1) {
      dirToRemove = this.serverElements[this.currentElementIdx].files[idx].name
    } else {
      dirToRemove = this.serverElements[idx].name
    }

    this.fileUploadService.removeDirectory(
      dirToRemove,
      (fileList: any) => {
        this.setUiElements(fileList)
        this.messageService.sendCustomMessage('success', '', 'Usunięto element')
      },
      () =>
        this.messageService.sendCustomMessage(
          'error',
          'Coś poszło nie tak',
          'Nie można w tej chwili usunąć katalogu',
          '',
          4000
        )
    )
  }
  addFolder(newFolderInput: HTMLInputElement) {
    let name = newFolderInput.value

    if (
      this.serverElements
        .filter((x) => !x.isFile)
        .find((x) => x.name.toLocaleLowerCase() == name.toLocaleLowerCase()) != undefined
    ) {
      this.messageService.sendCustomMessage('error', '', 'Katalog o podanej nazwie już istnieje', '', 4000)
      return
    }
    newFolderInput.value = ''
    this.fileUploadService.createDirectory(
      name,
      (fileList: any) => {
        this.setUiElements(fileList)
        this.messageService.sendCustomMessage('success', '', 'Utworzono katalog')
      },
      () =>
        this.messageService.sendCustomMessage(
          'error',
          'Coś poszło nie tak',
          'Nie można w tej chwili utworzyć katalogu',
          '',
          4000
        )
    )
  }
  setUiElements(fileList: DirElementInfo[]) {
    this.serverElements = fileList
    this.uiElements =
      this.currentElementIdx == -1 ? this.serverElements : this.serverElements[this.currentElementIdx].files
  }
}
