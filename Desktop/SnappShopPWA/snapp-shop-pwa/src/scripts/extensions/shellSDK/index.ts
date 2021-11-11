import {AppStore} from '@redux'
import EVENTS from './constants'

type Keys<D> = keyof D

type Registered<T> = Partial<{[name in keyof T]: T[name][]}>

type ImgDetail = {uploadProgress: number; url?: string}

export type Message = {
  id: number
  isModal: boolean
  deepLink?: string
  link?: string
  webLink?: string
  read: boolean
  text?: string
  title: string
  buttonText?: string
  modalImage?: string
}

enum Platform {
  iOS = 'PSAiOS',
  android = 'PSAANDROID',
}

enum AccuracyTypes {
  accuracyBestForNavigation = 0,
  accuracyBest = 1,
  accuracyKilometer = 2,
  accuracyThreeKilometers = 3,
}

enum ImageRequestType {
  CAMERA = 0,
  GALLERY = 1,
}

type Coords = {latitude: number; longitude: number}

class Shell {
  private static isServer: boolean

  private static store: AppStore

  private static platform?: Platform

  private static registeredCallbacks: Registered<
    typeof Shell.shellCallbacks
  > = {}

  private static callbacks: Partial<typeof Shell.shellCallbacks> = {}

  public static setup(store: AppStore) {
    const isServer = typeof window === 'undefined'

    Shell.isServer = isServer

    Shell.store = store

    if (!isServer) {
      Shell.setPlatform()

      Shell.setupCallbacks()

      window.shellCallbacks = Shell.getShellCallbacks()

      Shell.actions.requestDeviceInfo()

      document.documentElement.classList.add('isPSA')
    }
  }

  private static setPlatform() {
    const {userAgent} = window.navigator
    const [, platform] = userAgent.split('~~')
    switch (platform) {
      case Platform.android:
        Shell.platform = Platform.android
        // eslint-disable-next-line no-underscore-dangle
        window.__shell__platform = 'psa_android'
        break

      case Platform.iOS:
        Shell.platform = Platform.iOS
        // eslint-disable-next-line no-underscore-dangle
        window.__shell__platform = 'psa_ios'
        break
      default:
    }

    if (Shell.platform) window.isPSA = true
    else window.isPSA = false
  }

  private static shellCallbacks = {
    onPushClicked: (content: string) => {
      Shell.dispatchWindowEvent(EVENTS.PUSH_CLICKED, {content})
    },
    onPushReceived: (content: string) => {
      Shell.dispatchWindowEvent(EVENTS.PUSH_RECEIVED, {content})
    },
    onLocationReceived: (coords: Coords) => {
      Shell.dispatchWindowEvent(EVENTS.LOCATION_RECEIVED, coords)
    },
    onLocationError: (detail: any) => {
      Shell.dispatchWindowEvent(EVENTS.LOCATION_ERROR, detail)
    },
    onImgProgress(detail: ImgDetail) {
      Shell.dispatchWindowEvent(EVENTS.IMG_RECEIVED, detail)
    },
    onImgRecieved(detail: ImgDetail) {
      detail.uploadProgress = 1
      Shell.dispatchWindowEvent(EVENTS.IMG_RECEIVED, detail)
    },
    onBackKeyPressed() {
      Shell.dispatchWindowEvent(EVENTS.BACK_KEY_PRESSED)
    },
    onResume() {
      Shell.dispatchWindowEvent(EVENTS.RESUME)
    },
    onMessageOpened(detail: {messageId: number}) {
      Shell.dispatchWindowEvent(EVENTS.MESSAGE_OPENED, detail)
    },
    onInboxMessageReceived(detail: {success: boolean; message: string}) {
      const {success, message: text} = detail
      const message: Message = JSON.parse(text.replace(/\\n/g, '<br/>'))
      Shell.dispatchWindowEvent(EVENTS.MESSAGE_RECEIVED, {success, message})
    },
    onInboxMessagesReceived(detail: {success: boolean; messages: string}) {
      const {success, messages: text} = detail
      const messages: Message[] = JSON.parse(text.replace(/\\n/g, '<br/>'))
      Shell.dispatchWindowEvent(EVENTS.MESSAGES_RECEIVED, {success, messages})
    },
    onUnReadCountReceived(detail: {success: boolean; count: number}) {
      Shell.dispatchWindowEvent(EVENTS.UNREAD_MESSAGES_COUNT, detail)
    },
    onShortLinkResolved(result?: {url: string; requestCode: number}) {
      Shell.dispatchWindowEvent(EVENTS.SHORT_LINK_RESOLVED, result)
    },
    onSMSReceived(body: string) {
      Shell.dispatchWindowEvent(EVENTS.SMS_EVENT, body)
    },
  }

  private static setupCallbacks() {
    Object.keys(Shell.shellCallbacks).forEach(name => {
      const key = name as Keys<typeof Shell.callbacks>

      Shell.registeredCallbacks[key] = []

      Shell.callbacks[key] = (args?: any) => {
        Shell.shellCallbacks[key](args)

        const registered = Shell.registeredCallbacks[key]
        if (registered) {
          registered.forEach((callback: typeof registered[number]) => {
            callback(args)
          })
        }
      }
    })
  }

  private static getShellCallbacks() {
    return {
      init(data: any) {
        window.psaData = data
        window.psaData.optionalClient = window.psaData.client
      },
      ...Shell.callbacks,
    }
  }

  private static callNativeAPI(funcName: string, dict: any = {}) {
    if (Shell.isServer) return

    try {
      switch (Shell.platform) {
        case Platform.android:
          window.JsClient![funcName](dict)
          break

        case Platform.iOS:
          window.webkit!.messageHandlers[funcName].postMessage(dict)
          break

        default:
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  private static dispatchWindowEvent(eventName: string, detail?: any) {
    const event = new CustomEvent(eventName, {detail})
    window.dispatchEvent(event)
  }

  private static register(
    name: Keys<typeof Shell.callbacks>,
    callback?: (arg?: any) => void
  ) {
    if (callback) Shell.registeredCallbacks[name]!.push(callback)
    return Shell.unregister(name, callback)
  }

  private static unregister(
    name: Keys<typeof Shell.callbacks>,
    callback?: (arg: any) => void
  ) {
    return () => {
      if (!callback) return
      const index = Shell.registeredCallbacks[name]!.findIndex(
        (fn: typeof callback) => fn === callback
      )
      if (index !== -1) delete Shell.registeredCallbacks[name]![index]
    }
  }

  public static actions = {
    makeCall(phone: string) {
      return Shell.callNativeAPI(this.makeCall.name, {phone})
    },

    SMS(phone: string, body: string) {
      return Shell.callNativeAPI(this.SMS.name, {phone, body})
    },

    share(shareUrl: string, subject: string) {
      return Shell.callNativeAPI(this.share.name, {shareUrl, subject})
    },

    forceSwitch() {
      return Shell.callNativeAPI(this.forceSwitch.name)
    },

    requestImage(
      pickerType: ImageRequestType,
      onProgress?: typeof Shell.callbacks['onImgProgress'],
      onComplete?: typeof Shell.callbacks['onImgRecieved']
    ) {
      const unregisterProgress = Shell.register('onImgProgress', onProgress)
      const unregisterComplete = Shell.register('onImgRecieved', onComplete)
      Shell.callNativeAPI(this.requestImage.name, {pickerType})
      return () => {
        unregisterProgress()
        unregisterComplete()
      }
    },

    openInBrowser(url: string, shouldClose = false) {
      return Shell.callNativeAPI(this.openInBrowser.name, {url, shouldClose})
    },

    requestDeviceInfo() {
      return Shell.callNativeAPI(this.requestDeviceInfo.name)
    },

    requestLocationUpdates(
      accuracy: AccuracyTypes = AccuracyTypes.accuracyBest,
      onSuccess?: typeof Shell.callbacks['onLocationReceived'],
      onError?: typeof Shell.callbacks['onLocationError']
    ) {
      const unregisterSuccess = Shell.register('onLocationReceived', onSuccess)
      const unregisterError = Shell.register('onLocationError', onError)
      Shell.callNativeAPI(this.requestLocationUpdates.name, {accuracy})
      return () => {
        unregisterSuccess()
        unregisterError()
      }
    },

    stopLocationUpdates() {
      return Shell.callNativeAPI(this.stopLocationUpdates.name)
    },

    onClose() {
      return Shell.callNativeAPI(this.onClose.name)
    },

    interceptBackKey(
      status: boolean,
      onBackPressed?: typeof Shell.callbacks['onBackKeyPressed']
    ) {
      const unregisterBack = Shell.register('onLocationReceived', onBackPressed)
      Shell.callNativeAPI(this.interceptBackKey.name, {status})
      return unregisterBack
    },

    userLoggedIn(userInfo: object) {
      const info = JSON.stringify(userInfo)
      return Shell.callNativeAPI(this.userLoggedIn.name, info)
    },

    userLoggedOut() {
      return Shell.callNativeAPI(this.userLoggedOut.name)
    },

    initSMSListener(onSMSReceived?: typeof Shell.callbacks['onSMSReceived']) {
      const unregisterSMS = Shell.register('onSMSReceived', onSMSReceived)
      Shell.callNativeAPI(this.initSMSListener.name)
      return unregisterSMS
    },

    trackAdjustEvent(eventName: string, action: string) {
      const payload = {eventName, action}
      return Shell.callNativeAPI(this.trackAdjustEvent.name, payload)
    },

    getInboxMessages(
      onMessagesReceived?: typeof Shell.callbacks['onInboxMessagesReceived']
    ) {
      const unregisterMessages = Shell.register(
        'onInboxMessagesReceived',
        onMessagesReceived
      )
      Shell.callNativeAPI(this.getInboxMessages.name)
      return unregisterMessages
    },

    getInboxMessage(
      messageId: number,
      onMessageReceived?: typeof Shell.callbacks['onInboxMessageReceived']
    ) {
      const unregisterMessages = Shell.register(
        'onInboxMessageReceived',
        onMessageReceived
      )
      Shell.callNativeAPI(this.getInboxMessage.name, {messageId})
      return unregisterMessages
    },

    getUnReadCount(
      onCountReceived?: typeof Shell.callbacks['onUnReadCountReceived']
    ) {
      const unregisterMessages = Shell.register(
        'onUnReadCountReceived',
        onCountReceived
      )
      Shell.callNativeAPI(this.getUnReadCount.name)
      return unregisterMessages
    },

    setInboxMessageRead(messageId: number) {
      return Shell.callNativeAPI(this.setInboxMessageRead.name, {messageId})
    },

    deleteInboxMessageRead(messageId: number) {
      return Shell.callNativeAPI(this.deleteInboxMessageRead.name, {messageId})
    },

    resolveShortLink(
      url: string,
      requestCode: number,
      onLinkResolved?: typeof Shell.callbacks['onShortLinkResolved']
    ) {
      const unregisterMessages = Shell.register(
        'onShortLinkResolved',
        onLinkResolved
      )
      const payload = {url, requestCode}
      Shell.callNativeAPI(this.resolveShortLink.name, payload)
      return unregisterMessages
    },
  }
}
export default Shell
