import Shell from '.'

describe('Shell SDK', () => {
  const callbacks = [
    'onPushClicked',
    'onPushReceived',
    'onLocationReceived',
    'onLocationError',
    'onImgProgress',
    'onImgRecieved',
    'onBackKeyPressed',
    'onResume',
    'onMessageOpened',
    'onInboxMessageReceived',
    'onInboxMessagesReceived',
    'onUnReadCountReceived',
    'onShortLinkResolved',
    'onSMSReceived',
  ]

  test('Android platform', () => {
    jest
      .spyOn(window.navigator, 'userAgent', 'get')
      .mockImplementationOnce(() => `${window.navigator.userAgent}~~PSAANDROID`)
    Shell.setPlatform()

    expect(window.isPSA).toBe(true)
    expect(window.__shell__platform).toBe('psa_android')
  })

  test('iOS platform', () => {
    jest
      .spyOn(window.navigator, 'userAgent', 'get')
      .mockImplementationOnce(() => `${window.navigator.userAgent}~~PSAiOS`)
    Shell.setPlatform()

    expect(window.isPSA).toBe(true)
    expect(window.__shell__platform).toBe('psa_ios')
  })

  test('Shell callbacks', () => {
    expect(Object.keys(Shell.shellCallbacks)).toStrictEqual(callbacks)
  })

  test('Setup callbacks', () => {
    Shell.setupCallbacks()

    const shellCallbacks = Shell.getShellCallbacks()

    expect(Object.keys(shellCallbacks)).toStrictEqual(['init', ...callbacks])
  })

  test('Register and unregister', () => {
    const onProgress = jest.fn()
    const unregisterProgress = Shell.register('onImgProgress', onProgress)

    const detail = {uploadProgress: 0.5, url: ''}
    Shell.callbacks.onImgProgress(detail)

    expect(onProgress.mock.calls.length).toBe(1)
    expect(onProgress.mock.calls[0][0]).toBe(detail)

    unregisterProgress()

    Shell.callbacks.onImgProgress(detail)

    expect(onProgress.mock.calls.length).toBe(1)
  })

  test('Call native API', () => {
    const mockActionA = jest.fn()

    const name = 'funcName'
    const dict = {mock: 1}

    Shell.platform = 'PSAANDROID'

    window.JsClient = {[name]: mockActionA}

    Shell.callNativeAPI(name, dict)

    expect(mockActionA.mock.calls.length).toBe(1)
    expect(mockActionA.mock.calls[0][0]).toBe(dict)

    const mockActionB = jest.fn()

    Shell.platform = 'PSAiOS'

    window.webkit = {messageHandlers: {[name]: {postMessage: mockActionB}}}

    Shell.callNativeAPI(name, dict)

    expect(mockActionB.mock.calls.length).toBe(1)
    expect(mockActionB.mock.calls[0][0]).toBe(dict)
  })

  test('Dispatch window event', () => {
    const mockListener = jest.fn()
    const name = 'event-name'
    const detail = 123

    window.addEventListener(name, mockListener)

    Shell.dispatchWindowEvent(name, detail)

    expect(mockListener.mock.calls.length).toBe(1)
    expect(mockListener.mock.calls[0][0]).toMatchObject({detail: 123})
  })

  test('Actions call', () => {
    const mockFunc = jest.fn()
    jest.spyOn(Shell, 'callNativeAPI').mockImplementation(mockFunc)

    Shell.actions.makeCall()
    expect(mockFunc.mock.calls[0][0]).toBe('makeCall')

    Shell.actions.SMS()
    expect(mockFunc.mock.calls[1][0]).toBe('SMS')

    Shell.actions.share()
    expect(mockFunc.mock.calls[2][0]).toBe('share')

    Shell.actions.forceSwitch()
    expect(mockFunc.mock.calls[3][0]).toBe('forceSwitch')

    Shell.actions.requestImage()
    expect(mockFunc.mock.calls[4][0]).toBe('requestImage')

    Shell.actions.openInBrowser()
    expect(mockFunc.mock.calls[5][0]).toBe('openInBrowser')

    Shell.actions.requestDeviceInfo()
    expect(mockFunc.mock.calls[6][0]).toBe('requestDeviceInfo')

    Shell.actions.requestLocationUpdates()
    expect(mockFunc.mock.calls[7][0]).toBe('requestLocationUpdates')

    Shell.actions.stopLocationUpdates()
    expect(mockFunc.mock.calls[8][0]).toBe('stopLocationUpdates')

    Shell.actions.onClose()
    expect(mockFunc.mock.calls[9][0]).toBe('onClose')

    Shell.actions.interceptBackKey()
    expect(mockFunc.mock.calls[10][0]).toBe('interceptBackKey')

    Shell.actions.userLoggedIn()
    expect(mockFunc.mock.calls[11][0]).toBe('userLoggedIn')

    Shell.actions.userLoggedOut()
    expect(mockFunc.mock.calls[12][0]).toBe('userLoggedOut')

    Shell.actions.initSMSListener()
    expect(mockFunc.mock.calls[13][0]).toBe('initSMSListener')

    Shell.actions.trackAdjustEvent()
    expect(mockFunc.mock.calls[14][0]).toBe('trackAdjustEvent')

    Shell.actions.getInboxMessages()
    expect(mockFunc.mock.calls[15][0]).toBe('getInboxMessages')

    Shell.actions.getInboxMessage()
    expect(mockFunc.mock.calls[16][0]).toBe('getInboxMessage')

    Shell.actions.getUnReadCount()
    expect(mockFunc.mock.calls[17][0]).toBe('getUnReadCount')

    Shell.actions.setInboxMessageRead()
    expect(mockFunc.mock.calls[18][0]).toBe('setInboxMessageRead')

    Shell.actions.deleteInboxMessageRead()
    expect(mockFunc.mock.calls[19][0]).toBe('deleteInboxMessageRead')

    Shell.actions.resolveShortLink()
    expect(mockFunc.mock.calls[20][0]).toBe('resolveShortLink')
  })
})
