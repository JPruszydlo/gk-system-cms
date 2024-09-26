import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core'
import { TextEditorComponent } from '../../text-editor/text-editor.component'
import { CommonModule } from '@angular/common'
import { OffersService } from '../../services/offers.service'
import { Offer, OfferPlan, OfferVisualisation } from '../../models/Offer.model'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MessageService } from '../../services/customMessage.service'
import { InputFileComponent } from '../../components/input-file/input-file.component'
import { Image } from '../../models/ImageModel'
import { FileUploadService } from '../../services/fileUpload.service'
import { environment } from '../../environments/environment'
import { ProgressSpinnerModule } from 'primeng/progressspinner'

@Component({
  selector: 'app-for-sell',
  standalone: true,
  imports: [
    TextEditorComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputFileComponent,
    ProgressSpinnerModule,
  ],
  templateUrl: './for-sell.component.html',
  styleUrl: './for-sell.component.css',
})
export class ForSellComponent implements OnInit, AfterViewInit {
  listClass: string = 'hidden'
  detailsClass: string = 'hidden'
  assetsUrl = environment.assetsUrl
  dataSaved: boolean = true
  @ViewChildren('offerImage') offerImages: QueryList<ElementRef<HTMLImageElement>>
  @ViewChildren('offerPlanImage') offerPlanImages: QueryList<ElementRef<HTMLImageElement>>

  offers: Offer[] = []
  selectedOffer: Offer | undefined

  isNewOffer: boolean = false
  currentOfferDatabaseId: number = 0
  currentOfferIdx: number = 0

  detailsVisible: boolean = false
  emptyOffer: Offer = {
    available: true,
    createAt: new Date().getTime(),
    description: '',
    id: 0,
    name: '',
    name2: '',
    offerParams: [],
    offerPlans: [],
    offerVisualisations: [],
  }
  ngAfterViewInit(): void {
    this.offerImages.changes.subscribe((event: QueryList<ElementRef<HTMLImageElement>>) => {
      if (event.toArray().at(-1) == undefined) return
      let element = event.toArray().at(-1)!.nativeElement
      if (element.src.includes('base64')) {
        element.alt = this.baseToSrc[element.src]
        delete this.baseToSrc[element.src]
      }
    })
  }
  baseToSrc: { [key: string]: string } = {}
  addVisualisation(image: Image) {
    this.baseToSrc[image.base64] = image.filename
    this.selectedOffer!.offerVisualisations.push({ image: image.base64 })
  }
  constructor(
    private offersService: OffersService,
    private messageService: MessageService,
    private fileUpload: FileUploadService
  ) {}
  addNewOffer() {
    this.isNewOffer = true
    this.selectedOffer = structuredClone(this.emptyOffer)
    // this.detailsVisible = true
    this.detailsClass = 'fade-in'
  }
  getDateTime(tick: number) {
    let dateTime = new Date(tick).toISOString()
    return dateTime.split('T')[0]
    // return dateTime.replace('T', ' ').substring(0, dateTime.indexOf('.'))
  }

  addTimeStampToImage(offers: Offer[]) {
    offers = offers.map((o: Offer) => {
      o.offerVisualisations = o.offerVisualisations.map((v: OfferVisualisation) => ({
        image: v.image + '?' + Date.now(),
      }))
      o.offerPlans = o.offerPlans.map((p: OfferPlan) => ({
        image: p.image + '?' + Date.now(),
        floorName: p.floorName,
        offerPlanParams: p.offerPlanParams,
      }))
      return o as Offer
    })
    return offers
  }
  ngOnInit(): void {
    this.offersService.getOffers().then((result: Offer[]) => {
      result.sort((a: Offer, b: Offer) => b.createAt - a.createAt)
      result = this.addTimeStampToImage(result)

      this.offers = result
      this.currentOfferDatabaseId = 0
      this.isNewOffer = false
      this.selectedOffer = structuredClone(this.offers[0])
      this.listClass = 'fade-in'
    })
  }
  getImagesToUpload() {
    let images = this.offerImages.toArray().map((img: ElementRef<HTMLImageElement>) => {
      return img.nativeElement.src.includes('base64')
        ? [img.nativeElement.alt, img.nativeElement.src.split('base64,')[1]]
        : null
    })
    images = images.concat(
      this.offerPlanImages.toArray().map((img: ElementRef<HTMLImageElement>) => {
        return img.nativeElement.src.includes('base64')
          ? [img.nativeElement.alt, img.nativeElement.src.split('base64,')[1]]
          : null
      })
    )
    return images
  }
  submit() {
    this.dataSaved = false
    let images = this.offerImages
      .toArray()
      .map((img: ElementRef<HTMLImageElement>) => [
        img.nativeElement.alt.split('?')[0] ?? img.nativeElement.alt,
        img.nativeElement.src.split('base64,')[1],
      ])
    images = images.concat(
      this.offerPlanImages
        .toArray()
        .map((img: ElementRef<HTMLImageElement>) => [
          img.nativeElement.alt.split('?')[0] ?? img.nativeElement.alt,
          img.nativeElement.src.split('base64,')[1],
        ])
    )
    let selected = structuredClone(this.selectedOffer)

    this.fileUpload.uploadFile2(images, (response: any) => {
      let images = selected?.offerVisualisations.concat(selected.offerPlans)
      images?.forEach((img: any, index: number) => (images[index].image = response[index][0]))

      if (this.isNewOffer) {
        this.offersService.addOffer(
          selected as Offer,
          (offers: Offer[]) => {
            this.messageService.sendSaveSuccess()
            offers.sort((a: Offer, b: Offer) => b.createAt - a.createAt)
            this.offers = this.addTimeStampToImage(offers)
            this.detailsClosing(false)
            this.dataSaved = true
          },
          () => this.messageService.sendSaveFailed()
        )
        return
      }

      this.offersService.updateOffer(
        selected as Offer,
        this.currentOfferDatabaseId,
        (offers: Offer[]) => {
          this.messageService.sendSaveSuccess()
          offers.sort((a: Offer, b: Offer) => b.createAt - a.createAt)
          this.offers = this.addTimeStampToImage(offers)

          this.detailsClosing(false)
          this.dataSaved = true
        },
        () => this.messageService.sendSaveFailed()
      )
    })
  }
  showOffer(idx: number, dbIdx: number) {
    this.currentOfferDatabaseId = dbIdx
    this.currentOfferIdx = idx
    this.isNewOffer = false
    this.selectedOffer = structuredClone(this.offers[idx])
    this.detailsClass = 'fade-in'
    // this.detailsVisible = true
    // TODO
  }
  setOfferState(offerIdx: number, offerId: number, state: boolean) {
    this.offersService.setAvailableState(offerId, state).then(
      () => {
        this.offers[offerIdx].available = state

        this.messageService.sendCustomMessage(
          state ? 'success' : 'error',
          '',
          'Oferta ' + (state ? 'włączona' : 'wyłączona')
        )
      },
      () => {}
    )
  }
  updateParam(param: any, value: string) {
    if (param == undefined || value == undefined) return
    param = value
  }
  removeOffer(idx: number) {
    if (!confirm('Czy na pewno chcesz usunąć ofertę?')) return
    this.listClass = 'fade-out'
    this.offersService.deleteOffer(
      idx,
      (offers: any) => {
        this.messageService.sendSaveSuccess()
        offers.sort((a: Offer, b: Offer) => b.createAt - a.createAt)
        this.offers = offers
        this.listClass = 'fade-in'
      },
      () => this.messageService.sendSaveFailed()
    )
  }
  parseInt(number: string): number {
    return Number(number)
  }
  detailsClosing(askIfChange: boolean = true) {
    let notChanged = JSON.stringify(this.offers[0]) === JSON.stringify(this.selectedOffer)
    notChanged = notChanged && this.getImagesToUpload().filter((x) => x != null).length == 0
    if (askIfChange) {
      if (!notChanged) {
        if (!confirm('Nie zapisałeś zmian\nNa pewno chcesz zamknąć?')) return
      }
    }
    this.detailsClass = 'fade-out'
    // this.detailsVisible = false
    setTimeout(() => {
      this.selectedOffer = undefined
    }, 300)
  }
}
