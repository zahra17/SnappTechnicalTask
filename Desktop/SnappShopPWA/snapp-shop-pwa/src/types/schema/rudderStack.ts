export enum eventTypes {
  track,
  identify,
  pageView,
}
export interface RudderStackEvent {
  type: eventTypes
  eventName: string
  payload: {}
  page_name?: string
  page_category?: string
}
export interface RudderStackState {
  isInitialized: boolean
  eventTrigger: Function
}

export enum appName {
  new_desktop = 'Snappfood Desktop',
}

export enum namespace {
  staging = 'Staging',
  production = 'Production',
}
