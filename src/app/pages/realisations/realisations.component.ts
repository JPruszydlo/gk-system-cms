import { CommonModule } from '@angular/common'
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core'
import { Realisation, RealisationImage } from '../../models/Realisation.model'
import { RealisationsService } from '../../services/realisations.service'
import { MessageService } from '../../services/customMessage.service'
import { InputFileComponent } from '../../components/input-file/input-file.component'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { environment } from '../../environments/environment'
import { Image } from '../../models/ImageModel'
import { FileUploadService } from '../../services/fileUpload.service'

@Component({
  selector: 'app-realisations',
  standalone: true,
  imports: [CommonModule, InputFileComponent, ProgressSpinnerModule],
  templateUrl: './realisations.component.html',
  styleUrl: './realisations.component.css',
})
export class RealisationsComponent implements OnInit, AfterViewInit {
  assetsUrl: string = environment.assetsUrl
  realisations: Realisation[] = []
  realisationsOrigin: Realisation[] = []
  dataSaved: boolean = true
  baseToSrc: { [key: string]: string } = {}

  @ViewChildren('realisationImage') realisationImages: QueryList<ElementRef<HTMLImageElement>>
  @ViewChildren('saveButton') saveButtons: QueryList<ElementRef<HTMLButtonElement>>

  constructor(
    private realisationsService: RealisationsService,
    private messageService: MessageService,
    private fileUpload: FileUploadService
  ) {}

  setButtonHidden(realisationId: number) {
    this.saveButtons
      .toArray()
      .map((x) => x.nativeElement)
      .at(realisationId)
      ?.classList.replace('blink', 'hidden')
  }
  setButtonBlink(realisationId: number) {
    this.saveButtons
      .toArray()
      .map((x) => x.nativeElement)
      .at(realisationId)
      ?.classList.replace('hidden', 'blink')
  }
  ngAfterViewInit(): void {
    this.realisationImages.changes.subscribe((event: QueryList<ElementRef<HTMLImageElement>>) => {
      event.toArray().forEach((elRef: ElementRef<HTMLImageElement>) => {
        let img = elRef.nativeElement
        if (img.src.includes('base64')) {
          if (this.baseToSrc[img.src] != undefined) {
            img.alt = this.baseToSrc[img.src]
            delete this.baseToSrc[img.src]
          }
        }
      })
    })
  }
  addTimeStampToImage(realisations: Realisation[]) {
    // realisations = realisations.map((r: Realisation) => {
    //   r.realisationImages = r.realisationImages.map((ri: RealisationImage) => ({
    //     imageSrc: ri.imageSrc + '?' + Date.now(),
    //     isFavourite: ri.isFavourite,
    //     realisationImageId: ri.realisationImageId,
    //   }))
    //   return r as Realisation
    // })
    return realisations
  }
  addRealisationImage(realisationIdx: number, image: Image) {
    this.realisations[realisationIdx].realisationImages.push({
      imageSrc: image.base64,
      isFavourite: false,
      realisationImageId: -1,
    })
    this.baseToSrc[image.base64] = image.filename
    this.checkChanges(realisationIdx)
  }
  ngOnInit(): void {
    this.realisationsService.getRealisations().then((result: any) => {
      this.realisations = this.addTimeStampToImage(result)
      this.realisationsOrigin = structuredClone(result)
    })
  }
  addNewRealisation() {
    this.realisations.unshift({ realisationImages: [], name: '', id: -1 })
  }
  addToFavourite(idx1: number, idx2: number) {
    let isFavourite = !this.realisations[idx1].realisationImages[idx2].isFavourite
    this.realisations[idx1].realisationImages[idx2].isFavourite = isFavourite

    if (this.realisations[idx1].realisationImages[idx2].realisationImageId == -1) return
    this.realisationsService
      .addToFavourite(this.realisations[idx1].realisationImages[idx2].realisationImageId, isFavourite)
      .then(
        () => {
          this.realisations[idx1].realisationImages[idx2].isFavourite = isFavourite
        },
        () => {}
      )
  }

  descriptionChanged(event: any, idx: number) {
    if (this.realisationsOrigin[idx].name == event.target.value) this.setButtonHidden(idx)
    else this.setButtonBlink(idx)
    this.realisations[idx].name = event.target.value
  }
  removeRealisationImage(realisationId: number, imageId: number) {
    if (!confirm('Czy na pewno chcesz usunąć to zdjęcje?')) return
    this.realisations[realisationId].realisationImages.splice(imageId, 1)
    this.checkChanges(realisationId)
  }
  removeRealisation(idx: number) {
    if (!confirm('Czy na pewno chcesz usunąć realizację?')) return
    if (this.realisations[idx].id == -1) {
      this.realisations.splice(idx, 1)
      return
    }

    this.dataSaved = false
    this.realisationsService.removeRealisation(
      this.realisations[idx].id,
      (items: Realisation[]) => {
        this.realisations = items
        this.messageService.sendSaveSuccess()
        this.dataSaved = true
      },
      () => {
        this.dataSaved = true
        this.messageService.sendSaveFailed()
      }
    )
  }
  getRealisationCurrentImages(idx: number, withTimestamp = false) {
    return this.realisationImages
      .toArray()
      .filter((x) => parseInt(x.nativeElement.getAttribute('name') as string) == idx)
      .map((y) =>
        withTimestamp
          ? [y.nativeElement.alt, y.nativeElement.src.split('base64,')[1]]
          : [y.nativeElement.alt.split('?')[0] ?? y.nativeElement.alt, y.nativeElement.src.split('base64,')[1]]
      )
  }
  saveRealisation(idx: number) {
    this.dataSaved = false

    let dataToSave = structuredClone(this.realisations[idx])
    let realisationImages = this.getRealisationCurrentImages(idx)

    this.fileUpload.uploadFile2(realisationImages, (files: any) => {
      dataToSave.realisationImages = dataToSave.realisationImages.map((x: RealisationImage, index: number) => {
        return {
          imageSrc: files[index][0],
          isFavourite: x.isFavourite,
          realisationImageId: x.realisationImageId,
        }
      })
      this.realisationsService.addRealisations(
        dataToSave,
        (items: Realisation[]) => {
          this.realisations[idx] = items[idx]
          this.messageService.sendSaveSuccess()
          this.dataSaved = true
        },
        () => {
          this.dataSaved = true
          this.messageService.sendSaveFailed()
        }
      )
    })
  }

  checkChanges(realisationId: number) {
    setTimeout(() => {
      let isChanged = false
      let itemOrigin = this.realisationsOrigin[realisationId]
      let itemNew = this.realisations[realisationId]
      let originList = itemOrigin.realisationImages
      let currentList = this.getRealisationCurrentImages(realisationId, true).map((x) => x[0])
      if (JSON.stringify(originList) !== JSON.stringify(currentList)) isChanged = true
      if (itemNew.name !== itemOrigin.name) isChanged = true

      if (isChanged) this.setButtonBlink(realisationId)
      else this.setButtonHidden(realisationId)
    }, 200)
  }
}
