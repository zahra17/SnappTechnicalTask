import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import {toPersian, formatPrice, toEnglish} from '@sf/design-system'

import faCore from '@assets/locales/core/fa.json'
import {formatDate, formatTime} from '@utils'

i18n.use(initReactI18next).init({
  resources: {fa: {core: faCore}},
  lng: 'fa',
  fallbackLng: 'fa',
  preload: ['fa'],
  ns: ['core'],
  defaultNS: 'core',
  interpolation: {
    escapeValue: false,
    format: (value, format, lng) => {
      if (format === 'price') {
        if (lng === 'fa') return formatPrice(value)
        return value
      }
      if (format === 'number') {
        if (lng === 'fa') return toPersian(value)
        return toEnglish(value)
      }
      if (format === 'date') {
        if (lng === 'fa') return formatDate(value)
        return value.toLocaleDateString()
      }
      if (format === 'time') {
        if (lng === 'fa') return formatTime(value)
        return value.toLocaleTimeString()
      }
      return value
    },
  },
})

export default i18n
