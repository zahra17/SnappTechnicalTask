import {CTX} from '@root/types'

// import vendorSlice from '~menu/redux/vendor'
import i18n from '@i18n'
import growthFa from '@assets/locales/growth/fa.json'

const menuSideEffects = (ctx: CTX) => {
  // const {store} = ctx
}

i18n.addResourceBundle('fa', 'growth', growthFa)
export default menuSideEffects
