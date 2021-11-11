import {useTranslation} from 'react-i18next'
import {IBreadcrumb} from '~search/types/breadcrumb'
export function useRouteMap(): IBreadcrumb[] {
  const {t} = useTranslation()
  return [
    {
      superType: 0,
      serviceAliasType: '',
      path: '/',
      title: t('breadcrumb.base'),
    },
    {
      superType: 1,
      serviceAliasType: 'restaurant',
      path: '/service/restaurant?page=0&superType=1',
      title: t('breadcrumb.restaurant'),
    },
    {
      superType: 4,
      serviceAliasType: 'supermarket',
      path: '/service/supermarket?page=0&superType=4',
      title: t('breadcrumb.supermarket'),
    },
    {
      superType: 2,
      serviceAliasType: 'caffe',
      path: '/service/caffe?page=0&superType=2',
      title: t('breadcrumb.caffe'),
    },
    {
      superType: 5,
      serviceAliasType: 'bakery',
      path: '/service/bakery?page=0&superType=5',
      title: t('breadcrumb.bakery'),
    },
    {
      superType: 3,
      serviceAliasType: 'confectionery',
      path: '/service/confectionery?page=0&superType=3',
      title: t('breadcrumb.confectionery'),
    },
    {
      superType: 11,
      serviceAliasType: 'protein',
      path: '/service/protein?page=0&superType=11',
      title: t('breadcrumb.protein'),
    },
    {
      superType: 6,
      serviceAliasType: 'grocery',
      path: '/service/grocery?page=0&superType=6',
      title: t('breadcrumb.grocery'),
    },
    {
      superType: 8,
      serviceAliasType: 'juice',
      path: '/service/juice?page=0&superType=8',
      title: t('breadcrumb.juice'),
    },
    {
      superType: 7,
      serviceAliasType: 'nuts',
      path: '/service/nuts?page=0&superType=7',
      title: t('breadcrumb.nuts'),
    },
    {
      superType: 9,
      serviceAliasType: 'others',
      path: '/service/others?page=0&superType=9',
      title: t('breadcrumb.others'),
    },
    {
      filters: 'cuisineId-2',
      title: t('breadcrumb.iranian'),
    },
    {
      filters: 'cuisineId-3',
      title: t('breadcrumb.italian'),
    },
    {
      filters: 'cuisineId-4',
      title: t('breadcrumb.pizza'),
    },
    {
      filters: 'cuisineId-5',
      title: t('breadcrumb.seafood'),
    },
    {
      filters: 'cuisineId-8',
      title: t('breadcrumb.sandwich'),
    },
    {
      filters: 'cuisineId-9',
      title: t('breadcrumb.burger'),
    },
    {
      filters: 'cuisineId-12',
      title: t('breadcrumb.gilan'),
    },
    {
      filters: 'cuisineId-15',
      title: t('breadcrumb.fried'),
    },
    {
      filters: 'cuisineId-20',
      title: t('breadcrumb.indian'),
    },
    {
      filters: 'cuisineId-22',
      title: t('breadcrumb.steak'),
    },
    {
      filters: 'cuisineId-23',
      title: t('breadcrumb.arabic'),
    },
    {
      filters: 'cuisineId-25',
      title: t('breadcrumb.breakfast'),
    },
    {
      sorts: 'top_performance',
      title: t('breadcrumb.top_performance'),
    },
    {
      filters: 'has_discount',
      title: t('breadcrumb.has_discount'),
    },
    {
      filters: 'has_coupon',
      title: t('breadcrumb.has_coupon'),
    },
    {
      filters: 'vendorcollection-31',
      title: t('breadcrumb.latest'),
    },
    {
      filters: 'vendorcollection-32',
      title: t('breadcrumb.just'),
    },
  ]
}
