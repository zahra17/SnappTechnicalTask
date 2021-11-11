import React, {createContext, useContext, useState} from 'react'
import {Toast} from '@sf/design-system'

interface ToastState {
  status: 'alert' | 'success'
  message: string
  interval?: number
  onClose?: () => void
  top?: number
  bottom?: number
  right?: number
  left?: number
}

interface ShowToastFn {
  showToast: (args: ToastState) => void
}

const initialState: ToastState = {
  status: 'alert',
  top: 80,
  message: '',
  interval: 5000,
}

export const ToastContext = createContext<ShowToastFn>({showToast: () => {}})

const ToastProvider: React.FC = ({children}) => {
  const [toastState, setToastState] = useState(initialState)

  function showToast(state: ToastState) {
    setToastState(state)
  }

  function handleClose() {
    setToastState(initialState)
    typeof toastState.onClose === 'function' && toastState.onClose()
  }

  const toastArgs: ToastState = {
    ...initialState,
    ...toastState,
  }
  return (
    <ToastContext.Provider value={{showToast}}>
      {children}
      <Toast {...toastArgs} onCloseToast={handleClose} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

export default ToastProvider
