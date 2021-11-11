import {useState} from 'react'

import {isAPIResponse} from '@api'
import {useToast} from '@contexts/Toast'
import requests from '~order/endpoints'
import {SpecialPayCode} from '@schema/basket'
import {SpecialPaymentResponse} from '@schema/order'

const transactions = {
  [SpecialPayCode.debit]: requests.directDebitPayment,
  [SpecialPayCode.snapp]: requests.snappCreditPayment,
}

export const useSpecialTransaction = () => {
  const [loading, setLoading] = useState(false)

  const {showToast} = useToast()

  const handler = async (code: string, orderCode: string) => {
    const bankCode = code as SpecialPayCode

    let result = false

    if (bankCode in transactions) {
      setLoading(true)

      await transactions[bankCode]<SpecialPaymentResponse>({
        urlParams: {orderCode},
      })
        .then(response => {
          if (isAPIResponse(response)) {
            if (response.data.status) result = true
            else throw response.data.error?.message
          } else {
            throw 'api-error'
          }
        })
        .catch(err => {
          if (typeof err === 'string') {
            showToast({message: err, status: 'alert'})
          }
        })

      setLoading(false)
    } else {
      result = true
    }
    return result
  }
  return {handler, loading}
}
