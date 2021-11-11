import {CTX} from '@root/types'

import i18n from '@i18n'
import searchFa from '@assets/locales/search/fa.json'

export const searchSideEffects = async (ctx: CTX) => {
  const {store} = ctx
}

i18n.addResourceBundle('fa', 'search', searchFa)

export default searchSideEffects
