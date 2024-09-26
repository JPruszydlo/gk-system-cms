import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  QueryList,
  SimpleChange,
  ViewChild,
  ViewChildren,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { SelectButtonModule } from 'primeng/selectbutton'
import { FormsModule } from '@angular/forms'
import { CarouselService } from '../../services/carousel.service'
import { CarouselItem } from '../../models/CarouselItem.model'
import { MessageService } from '../../services/customMessage.service'
import { InputFileComponent } from '../input-file/input-file.component'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { FileUploadService } from '../../services/fileUpload.service'
import { Image } from '../../models/ImageModel'
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-banner-config',
  standalone: true,
  imports: [InputFileComponent, CommonModule, SelectButtonModule, FormsModule, ProgressSpinnerModule],
  templateUrl: './banner-config.component.html',
  styleUrl: './banner-config.component.css',
})
export class BannerConfigComponent implements OnChanges {
  assetsUrl: string = environment.assetsUrl
  @ViewChildren('CarouselItem') CarouselItemsRef: QueryList<ElementRef<HTMLDivElement>>
  @ViewChild('oneItemImage') oneItemImage: ElementRef<HTMLImageElement>

  @Input({ required: true }) pageName: string = ''
  stateOptions: any[] = [
    { label: 'Karuzela', value: 'carousel' },
    { label: 'Jedno zdjęcie', value: 'one-item' },
  ]
  @Input() selectedBannerType: string | null = null
  @Input() carouselConfig: CarouselItem[] = []
  carouselItems: CarouselItem[] | undefined
  oneItemConfig: CarouselItem | undefined
  dataSaved: boolean = true
  imgPageName: string = ''
  constructor(
    private carouselService: CarouselService,
    private messageService: MessageService,
    private fileUpload: FileUploadService
  ) {}

  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    let change: SimpleChange = changes['carouselConfig']
    if (change == undefined || change.currentValue.length <= 0) return

    this.carouselItems = this.carouselConfig.filter((x) => x.subPage == this.pageName)

    this.carouselItems = this.carouselItems.map((c: CarouselItem) => {
      c.image = c.image == '' ? '' : c.image + '?' + Date.now()
      return c
    })

    this.oneItemConfig = structuredClone(this.carouselItems[0])

    if (this.carouselItems.length > 1) {
      this.selectedBannerType = 'carousel'
      return
    }
    if (this.carouselItems[0].image != '') {
      this.selectedBannerType = 'one-item'
    }
  }
  textChanged(event: any, element: string, index: number) {
    if (this.carouselItems == undefined) return
    if (element == 'title') this.carouselItems[index].contentTitle = event.target.value
    if (element == 'text') this.carouselItems[index].contentText = event.target.value
  }

  saveChanges() {
    this.dataSaved = false
    let itemsToUpload: any = []
    let itemsToDb: CarouselItem[] = []
    if (this.selectedBannerType == 'one-item') {
      itemsToUpload.push([
        this.oneItemImage.nativeElement.alt.split('?')[0],
        this.oneItemImage.nativeElement.src.split('base64,')[1],
      ])
    } else if (this.selectedBannerType == 'carousel') {
      itemsToUpload = this.CarouselItemsRef.toArray().map((x: ElementRef<HTMLDivElement>) => {
        let imageElement = x.nativeElement.querySelector('p img') as HTMLImageElement
        return [imageElement.alt.split('?')[0], imageElement.src.split('base64,')[1]]
      })
    } else {
      itemsToUpload = null
    }
    this.fileUpload.uploadFile2(itemsToUpload, (response: any) => {
      if (this.selectedBannerType == 'one-item' || this.selectedBannerType == null) {
        itemsToDb = [
          {
            contentText: '',
            contentTitle: '',
            image: response == null ? '' : response[0][0],
            subPage: this.pageName,
          },
        ]
      } else {
        itemsToDb = this.CarouselItemsRef.toArray().map((x: ElementRef<HTMLDivElement>, index: number) => {
          let titleInput = x.nativeElement.children[1] as HTMLInputElement
          let descriptionInput = x.nativeElement.children[2] as HTMLTextAreaElement

          return {
            contentText: descriptionInput.value,
            contentTitle: titleInput.value,
            image: response[index][0],
            subPage: this.pageName,
          }
        })
      }
      this.carouselService.setConfig(
        itemsToDb,
        () => {
          this.messageService.sendSaveSuccess()
          this.dataSaved = true
        },
        () => {
          this.messageService.sendSaveFailed()
          this.dataSaved = true
        }
      )
    })
  }
  addCarouselItem() {
    if (this.carouselItems == undefined) return
    this.carouselItems.push({
      contentText: '',
      contentTitle: '',
      image: '',
      subPage: this.pageName,
    })
  }
  removeCarouselItem(index: number) {
    if (this.carouselItems == undefined) return
    if (confirm('Na pewno chcesz usunąć ten element?')) {
      this.carouselItems.splice(index, 1)
    }
  }
  imageChanged(image: Image, imgElement: HTMLImageElement) {
    imgElement.src = image.base64
    imgElement.alt = image.filename
  }
  // imageChanged(id: number, src: string) {
  //   if (id == -1) {
  //     if (this.oneItemConfig != undefined) this.oneItemConfig.image = src
  //     return
  //   }
  //   if (this.carouselItems == undefined) return
  //   this.carouselItems[id].image = src
  // }
  oneItemImageChagned(src: string) {
    if (this.oneItemConfig == undefined) return
    this.oneItemConfig.image = src
  }
  getCarouselItem(id: number): CarouselItem {
    if (this.carouselItems == undefined) return { contentText: '', contentTitle: '', image: '', subPage: '' }
    return this.carouselItems[id]
  }
}
