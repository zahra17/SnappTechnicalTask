import * as Sentry from '@sentry/react'

import '@styles/index.scss'
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import '@i18n'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // release: `${process.env.NAME}@${process.env.APP_VERSION}`,
  normalizeDepth: 4,
})

export const reportWebVitals = () => {}

export {default} from '@root/index'
