export type RealisationImage = {
  realisationImageId: number
  imageSrc: string
  isFavourite: boolean
}
export type Realisation = {
  id: number
  name: string
  realisationImages: RealisationImage[]
}
