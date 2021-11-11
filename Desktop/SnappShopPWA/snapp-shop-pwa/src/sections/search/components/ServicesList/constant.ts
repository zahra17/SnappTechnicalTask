import BooksImg from '@assets/locales/search/shop-services-images/culture-and-art.png'
import CosmeticsImg from '@assets/locales/search/shop-services-images/cosmetic.png'
import DigitalImg from '@assets/locales/search/shop-services-images/digital.png'
import FashionImg from '@assets/locales/search/shop-services-images/cloths.png'
import HomeAndKitchenImg from '@assets/locales/search/shop-services-images/HomeAndKitchen.png'
import {useTranslation} from 'react-i18next'

export const services = () => {
  const {t} = useTranslation()

  const items = [
    {
      id: 12,
      superTypeAlias: 'COSMETIC',
      icon: [CosmeticsImg.src],
      icon_custom: [CosmeticsImg.src],
      title: t('search:services.cosmetic'),
      deepLink: '',
      is_link_external: false,
      background_color: '#FF8357',
      status_text: '',
      new_page: false,
    },
    {
      id: 15,
      superTypeAlias: 'DIGITAL',
      icon: [DigitalImg.src],
      icon_custom: [DigitalImg.src],
      title: t('search:services.digital'),
      deepLink: '',
      is_link_external: false,
      background_color: '#BDE26E',
      status_text: '',
      new_page: true,
    },
    {
      id: 13,
      superTypeAlias: 'BOOK',
      icon: [BooksImg.src],
      icon_custom: [BooksImg.src],
      title: t('search:services.book'),
      deepLink: '',
      is_link_external: false,
      background_color: '#FAD4BF',
      status_text: '',
      new_page: false,
    },
    {
      id: 14,
      superTypeAlias: 'FASHION',
      icon: [FashionImg.src],
      icon_custom: [FashionImg.src],
      title: t('search:services.fashion'),
      deepLink: '',
      is_link_external: false,
      background_color: '#F5D0EF',
      status_text: '',
      new_page: false,
    },
    {
      id: 17,
      superTypeAlias: 'HOME-AND-KITCHEN',
      icon: [HomeAndKitchenImg.src],
      icon_custom: [HomeAndKitchenImg.src],
      title: t('search:services.home_and_kitchen'),
      deepLink: '',
      is_link_external: false,
      background_color: '#FAE2BF',
      status_text: '',
      new_page: false,
    },
  ]

  return items
}
