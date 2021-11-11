import {getUUID} from '@utils'

const isServer = typeof window === 'undefined'

const BASE_URL = isServer ? process.env.SERVER_BASE_URL! : process.env.BASE_URL!

export default {
  BASE_URL: BASE_URL,
  CDN_BASE_URL: process.env.CDN_PATH!,
  DEFAULT_LOCALE: process.env.DEFAULT_LOCALE!,
  VERSION: process.env.APP_VERSION!,
  CLIENT: process.env.CLIENT!,
  LAT: +process.env.DEFAULT_LATITUDE!,
  LONG: +process.env.DEFAULT_LONGITUDE!,
  UUID: getUUID(),
}
