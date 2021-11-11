import {useEffect, useMemo, useRef, useState} from 'react'

import {isAPIResponse} from '@api'
import requests from '~order/endpoints'
import {
  Basket,
  PaymentType,
  SpecialPayCode,
  SpecialPaymentInfo,
} from '@schema/basket'
import {useAppDispatch} from '@redux'
import {basketActions} from '@slices/baskets'

type SpecialPayRecord<T> = Partial<Record<SpecialPayCode, T>>
type SpecialInfo = SpecialPayRecord<
  SpecialPaymentInfo['data'] & {
    order: number
  }
>
type SortedInfo = Partial<SpecialPaymentInfo['data'] & {code: SpecialPayCode}>[]

const gateways = [
  {
    name: SpecialPayCode.debit,
    fetcher: requests.getDirectDebitInfo,
    show: true,
  },
  {
    name: SpecialPayCode.snapp,
    fetcher: requests.getSnappCreditInfo,
    show: false,
  },
]

export const useSpecialPayment = (basket?: Basket) => {
  const dispatch = useAppDispatch()

  const [info, setInfo] = useState<SpecialInfo>()
  const [isActive, setIsActive] = useState<SpecialPayRecord<boolean>>()

  const autoSelectRef = useRef<SpecialPayRecord<boolean>>({})

  const setBankCode = (bank: string) => {
    dispatch(
      basketActions.updateBasket({
        vendorCode: basket!.vendor.vendorCode,
        paymentType: PaymentType.ONLINE,
        bank,
      })
    )
  }

  useEffect(() => {
    Object.keys(info ?? {}).forEach(code => {
      const bankCode = code as SpecialPayCode
      let isActive = false
      const maxAmount = info?.[bankCode]?.maxAmount
      if (typeof maxAmount === 'number' && typeof basket?.total === 'number') {
        isActive = maxAmount >= basket.total
      }
      setIsActive(info => ({...info, [bankCode]: isActive}))
    })
  }, [basket?.total, info])

  // Auto select gateway
  useEffect(() => {
    if (!info || !isActive) return
    let hasActiveSpecialBank = false
    for (let i = 0; i < sortedInfo.length; i++) {
      const special = sortedInfo[i]
      if (info[special.code!] && isActive[special.code!]) {
        hasActiveSpecialBank = true
        if (
          basket?.bank !== special.code &&
          !autoSelectRef.current[special.code!]
        ) {
          autoSelectRef.current[special.code!] = true
          setBankCode(special.code!)
        }
        break
      }
    }
    const currentCode = basket?.bank
    const specialCodes: string[] = Object.values(SpecialPayCode)
    if (!hasActiveSpecialBank && specialCodes.includes(currentCode ?? '')) {
      if (basket!.options?.gateways?.length) {
        const [gateway] = basket!.options.gateways
        setBankCode(gateway.bankCode)
      }
    }
  }, [isActive])

  useEffect(() => {
    gateways
      .filter(({show}) => show)
      .forEach(({name, fetcher}, index) => {
        fetcher<SpecialPaymentInfo>()
          .then(res => {
            if (isAPIResponse(res) && res.data?.data?.bankStatus) {
              setInfo(info => ({
                ...info,
                [name]: {...res.data.data, order: index},
              }))
            }
          })
          .catch(err => {
            console.error(err)
          })
      })
  }, [])

  const sortedInfo: SortedInfo = useMemo(() => {
    return Object.keys(info ?? {})
      .sort((a, b) => {
        return (
          info![a as SpecialPayCode]!.order - info![b as SpecialPayCode]!.order
        )
      })
      .map(code => ({
        ...info![code as SpecialPayCode],
        code: code as SpecialPayCode,
      }))
  }, [info])

  return {info, sortedInfo, isActive}
}
