export type OfferParam = {
  name: string
  value: string
}
export type OfferPlan = {
  image: string
  floorName: string
  offerPlanParams: OfferParam[]
}
export type OfferVisualisation = {
  image: string
}
export type Offer = {
  id: number
  createAt: number
  available: boolean
  name: string
  name2: string
  description: string
  offerPlans: OfferPlan[]
  offerParams: OfferParam[]
  offerVisualisations: OfferVisualisation[]
}
