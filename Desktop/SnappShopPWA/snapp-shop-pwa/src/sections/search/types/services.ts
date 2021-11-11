export interface Service {
  id: number
  icon: string[]
  icon_custom: string[]
  title: string
  deepLink: string
  background_color: string
  status_text: string
  new_page: boolean
  superTypeAlias: string
}
export type ServicesResponse = {
  status: boolean
  data: {
    items: Service[]
  }
}
