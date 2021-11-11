import {SHOP_SERVICE_OPTIONS} from '~search/types'
import i18n from '@i18n'
import {TruckIcon, OriginalIcon, ReturnIcon} from '@sf/design-system'

export const SHOP_OPTIONS: SHOP_SERVICE_OPTIONS[] = [
  {
    id: 1,
    title: i18n.t('options.delivery.title'),
    description: i18n.t('options.delivery.description'),
    Icon: TruckIcon,
  },
  {
    id: 2,
    title: i18n.t('options.original-products.title'),
    description: i18n.t('options.original-products.description'),
    Icon: OriginalIcon,
  },
  {
    id: 3,
    title: i18n.t('options.free-return.title'),
    description: i18n.t('options.free-return.description'),
    Icon: ReturnIcon,
  },
]
