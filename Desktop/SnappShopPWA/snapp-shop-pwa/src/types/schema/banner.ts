export interface Banner {
  alert_text: string
  deepLink: string
  description: string
  descriptionColor: string
  has_token: boolean
  id: number
  image: string
  image_custom: string
  index: number
  is_external_link: boolean
  link: string
  position: number
  rank: number
  ratio: number
  style: number
  title: string
  titleColor: string
  type: string
  vendor_collection: number
  viewCount: number
}

export class BannerModel {
  constructor(public banner: Banner) {}
}
