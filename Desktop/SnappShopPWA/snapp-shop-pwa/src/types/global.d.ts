declare interface Window {
  isPSA: boolean
  psaData: any
  shellCallbacks: any
  // eslint-disable-next-line camelcase
  __shell__platform: 'psa_ios' | 'psa_android' | undefined
  JsClient?: {[key: string]: (dict: object) => void}
  webkit?: {
    messageHandlers: {[key: string]: {postMessage: (dict: object) => void}}
  }
}
