import {v4} from 'uuid'
import cookies from 'js-cookie'

import {Product, ProductBase, ProductIdentity} from '@schema/product'
import {formatPrice, toPersian} from '@sf/design-system'
import {Schedule, SortedSchedules} from '@schema/vendor'

export * from './cookies'
export * from './sodium'
export * from './lock'
export * from './matchers'
export * from './city-codes'
export * from './numberToWords'
export * from './app-events'

export const getUUID = () => {
  let UUID = cookies.get('UUID')
  if (UUID) return UUID
  UUID = v4()
  cookies.set('UUID', UUID, {expires: 99999})
  return UUID
}

export const getProductUniqueId = (product: ProductIdentity) => {
  const toppings =
    product.toppings?.map(topping => +topping.id).sort((a, b) => a - b) ?? []
  return [+product.id, ...toppings]
}
export const prepareProductToPost = (product: ProductBase) => {
  const toppings: {id: number; count: 1}[] = []
  product.toppings?.forEach(topping => {
    toppings.push({id: topping.id, count: 1})
  })
  return {
    id: product.id,
    count: product.count,
    toppings: toppings,
  }
}

export const basketIdStorage = {
  key: 'basketId',
  store(vendorCode: string, id?: string) {
    const cookieId = this.getID(vendorCode)
    if (id !== cookieId) {
      if (id) cookies.set(this.key, {id, vendorCode}, {expires: 1})
      else cookies.remove(this.key)
    }
  },
  restore(currentVendorCode: string, cookie: any) {
    const {id = '', vendorCode = ''} = typeof cookie === 'object' ? cookie : {}
    if (currentVendorCode === vendorCode && id) return id as string
    cookies.remove(this.key)
    return undefined
  },
  getID(vendorCode: string) {
    return this.restore(vendorCode, cookies.getJSON(this.key))
  },
  extract(vendorCode: string, cookies: any) {
    return this.restore(vendorCode, cookies[this.key])
  },
}

export const compareProducts = (
  productA: ProductIdentity,
  productB: ProductIdentity
) => {
  const sameProduct = productA.id === productB.id
  if (!sameProduct) return false

  const idA = getProductUniqueId(productA)
  const idB = getProductUniqueId(productB)

  const sameLength = idA.length === idB.length
  if (!sameLength) return false

  return idA.reduce((prev, current, i) => {
    return prev && current === idB[i]
  }, true)
}

export type TimeObject = {h: number; m?: number; s?: number}

export const getFixedTime = ({h, m = 0, s = 0}: TimeObject) => {
  const time = new Date()
  time.setHours(h)
  time.setMinutes(m)
  time.setSeconds(s)
  time.setMilliseconds(0)
  return time
}

export const checkTimeRange = (start: TimeObject, end: TimeObject) => {
  const currentTime = new Date()
  const startTime = getFixedTime(start)
  const endTime = getFixedTime(end)
  return currentTime > startTime && currentTime < endTime
}

export const multilineEllipsis = (
  text: string,
  sliceLength: number = 130
): string => {
  return text.length > sliceLength
    ? text.slice(0, sliceLength).padEnd(sliceLength + 3, '...')
    : text
}

export const cellNumberValidation = (phoneNumber: string) => {
  const regex = /(?:^0?$|^09?$|^09)\d{0,9}$/g
  return regex.test(phoneNumber)
}

export const secondsToTime = (sec: number, mode: string = 'H:M:S'): string => {
  const h = Math.floor(sec / 3600)
      .toString()
      .padStart(2, '0'),
    m = Math.floor((sec % 3600) / 60)
      .toString()
      .padStart(2, '0'),
    s = Math.floor(sec % 60)
      .toString()
      .padStart(2, '0')
  switch (mode) {
    case 'H':
      return h
    case 'M':
      return m
    case 'S':
      return s
    case 'M:S':
      return m + ':' + s
    case 'H:M:S':
    default:
      return h + ':' + m + ':' + s
  }
}

export function getWeekDayName(day: number) {
  switch (day) {
    case 1:
      return 'شنبه'
    case 2:
      return 'یکشنبه'
    case 3:
      return 'دوشنبه'
    case 4:
      return 'سه‌شنبه'
    case 5:
      return 'چهارشنبه'
    case 6:
      return 'پنجشنبه'
    case 7:
      return 'جمعه'
  }
}

export function monthByPersianDigit(month: string) {
  switch (month) {
    case '۰۱':
    case '۱':
      return 'فروردین'
    case '۰۲':
    case '۲':
      return 'اردیبهشت'
    case '۰۳':
    case '۳':
      return 'خرداد'
    case '۰۴':
    case '۴':
      return 'تیر'
    case '۰۵':
    case '۵':
      return 'مرداد'
    case '۰۶':
    case '۶':
      return 'شهریور'
    case '۰۷':
    case '۷':
      return 'مهر'
    case '۰۸':
    case '۸':
      return 'آبان'
    case '۰۹':
    case '۹':
      return 'آذر'
    case '۱۰':
      return 'دی'
    case '۱۱':
      return 'بهمن'
    case '۱۲':
      return 'اسفند'
  }
}

export function localizeDate(date: string) {
  return date
    .split('/')
    .reverse()
    .map((part, i) => {
      switch (i) {
        case 1:
          return monthByPersianDigit(part)
        default:
          return part
      }
    })
    .join(' ')
}

export const formatDate = (date: Date) =>
  localizeDate(date.toLocaleDateString('fa-IR'))

export const formatTime = (date: Date) =>
  date.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

export const persianPrice = (val: string) => toPersian(formatPrice(val))

export const sortBaseOnHours = (a: Schedule, b: Schedule) => {
  const time1 = new Date('01/01/2018 ' + a['startHour'])
  const time2 = new Date('01/01/2018 ' + b['stopHour'])

  return time1 === time2 ? 0 : time1 < time2 ? -1 : 1
}

export const sortVendorSchedules = (schedules: Schedule[]) => {
  const sotredSchedules: SortedSchedules[] = []

  if (schedules.length) {
    const sortedData = [...schedules].sort((a, b) => a.weekday - b.weekday)

    for (let index = 1; index < 8; index++) {
      const filteredData = sortedData.filter(shift => shift.weekday === index)
      const sorted = filteredData.sort(sortBaseOnHours)

      sotredSchedules.push({
        weekday: index,
        schedules: sorted,
      })
    }
  }

  return sotredSchedules
}

export const getProductVarationData = (product: Product): Product => {
  let title = ''

  if (product.productId && product.productTitle) {
    title = product.productTitle
  } else {
    title = product.title
  }

  return {
    ...product,
    title: title,
  }
}

export const getName = (
  param?: string | string[] | number | number[] | null
) => {
  if (!param) return null
  if (Array.isArray(param) && param.length > 0) return param[0]
  return String(param)
}

export const truncate = (string: string, length = 25) => {
  if (string.length <= length) return string
  return `${string.substr(0, length)}...`
}
