import React, {FC, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'

import {useAppDispatch} from '@redux'
import {useToast} from '@contexts/Toast'
import {selectBasketAPI, clearErrors} from '@slices/baskets'

const useBasketError = (vendorCode: string) => {
  const {t} = useTranslation()

  const {showToast} = useToast()

  const dispatch = useAppDispatch()
  const basketAPI = useSelector(selectBasketAPI(vendorCode))

  const clearError = () => {
    dispatch(clearErrors(vendorCode))
  }

  const apiError = basketAPI?.error.message
  const isNetworkError = basketAPI?.error.isNetworkError
  const message = isNetworkError ? t('order:network-error') : apiError ?? ''

  const showToastError = !basketAPI?.error.actions.includes('setVoucher') //check if error is Voucher related

  useEffect(() => {
    if (showToastError) {
      showToast({message, status: 'alert', onClose: clearError})
    }
  }, [message])

  useEffect(() => clearError, [])
}

export default useBasketError
