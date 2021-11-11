import {Address} from '@schema/address'
import {CityLocation} from '@schema/location'
import {SuperType} from '@schema/vendorListTypes'
import {CITY_CODES, getCityCodeById, getName} from '@utils'
import router from 'next/router'
import {UrlObject} from 'url'
import {PinnedLocation, RedirectURL} from '.'

export const getCityInfo = (data: PinnedLocation, cities: CityLocation[]) => {
  const cityByCities = cities.find(item => item.id === data.cityId)
  const currentCity =
    Object.values(CITY_CODES).find(
      item => item.title && data.cityName && data.cityName.includes(item.title)
    ) ||
    Object.values(CITY_CODES).find(
      item =>
        item.title && data.countyName && data.countyName.includes(item.title)
    ) ||
    Object.values(CITY_CODES).find(
      item =>
        item.title &&
        data.provinceName &&
        data.provinceName.includes(item.title)
    )
  const cityId = currentCity?.id || data.cityId || null
  const cityCode =
    Object.keys(CITY_CODES).find(
      item => Object(CITY_CODES)[item] === currentCity
    ) ||
    cityByCities?.code ||
    null
  const cityName_fa = currentCity?.title || cityByCities?.title

  return {
    cityId,
    cityCode,
    cityName_fa,
  }
}

export const getRoute = (
  {selectedCity, query, isNewAddress}: RedirectURL,
  isLogin: boolean,
  activeAddress?: Address
) => {
  const superType = query.superType
    ? getName(query.superType)
    : Object(SuperType)[String(getName(query.service) || '').toUpperCase()]

  if (
    !superType ||
    superType === 0 ||
    !!query.cuisine ||
    String(getName(query.service) || '').toLowerCase() === 'search-vendors' ||
    !!query.chainName
  )
    return null
  const active_cityId = activeAddress?.city?.id || -1
  const active_cityCode = getCityCodeById(String(active_cityId))
  const router_cityCode = query.cityName
  const near = query.asPath && query.asPath.includes('near')
  const addressDetail = localStorage.getItem('addressDetails')
  const savedAddress = !!addressDetail && JSON.parse(addressDetail || '')
  const cityNameInSavedAddress = savedAddress.cityCode
  const searchParams = new URLSearchParams()

  searchParams.set('page', query.page ? String(query.page) : '0')

  if (query.section) {
    searchParams.set('section', query.section)
  }
  searchParams.set('superType', superType)
  if (query.category)
    searchParams.set(
      'category',
      `${query.category.value}${
        (query.category.sub && '->' + query.category.sub) || ''
      }`
    )
  if (query.filters)
    query.filters.forEach(item => item && searchParams.append('filters', item))
  if (query.extraFilter) searchParams.set('extraFilters', query.extraFilter)

  if (isLogin && !near && active_cityCode && query.service !== 'all') {
    const route: UrlObject = {
      pathname: `/service/${query?.service}/city/${active_cityCode}/near`,
      search: searchParams.toString(),
    }
    return route
  }
  if (
    router_cityCode &&
    cityNameInSavedAddress &&
    router_cityCode !== selectedCity?.code &&
    !isLogin &&
    isNewAddress
  ) {
    const route: UrlObject = {
      pathname: `/service/${query?.service}/city/${cityNameInSavedAddress}/near`,
      search: searchParams.toString(),
    }
    return route
  } else if (
    router_cityCode &&
    cityNameInSavedAddress &&
    !isLogin &&
    isNewAddress
  ) {
    const route: UrlObject = {
      pathname: `/service/${query?.service}/city/${cityNameInSavedAddress}/near`,
      search: searchParams.toString(),
    }
    return route
  } else if (
    router_cityCode &&
    active_cityCode &&
    active_cityCode !== router_cityCode &&
    near
  ) {
    const route: UrlObject = {
      pathname: `/service/${query?.service}/city/${active_cityCode}/near`,
      search: searchParams.toString(),
    }
    return route
  } else if (
    !isLogin &&
    !!savedAddress?.cityCode &&
    router_cityCode &&
    savedAddress?.cityCode.toLocaleLowerCase() !==
      router_cityCode?.toString().toLocaleLowerCase() &&
    near
  ) {
    const route: UrlObject = {
      pathname: `/service/${query?.service}/city/${savedAddress?.cityCode}/near`,
      search: searchParams.toString(),
    }
    return route
  }
  if (router_cityCode && near && !isLogin && !cityNameInSavedAddress) {
    const route: UrlObject = {
      pathname: `/service/${query?.service}/city/${router_cityCode}`,
      search: searchParams.toString(),
    }
    return route
  }
  if (
    !router_cityCode &&
    !isLogin &&
    (cityNameInSavedAddress || selectedCity?.code)
  ) {
    const route: UrlObject = {
      pathname: `/service/${query?.service}/city/${
        cityNameInSavedAddress || selectedCity?.code
      }/near`,
      search: searchParams.toString(),
    }
    return route
  }
}
