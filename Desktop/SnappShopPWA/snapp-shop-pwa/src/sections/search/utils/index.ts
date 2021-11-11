import {HOME_SECTION_TYPE} from '~search/types'
import {LinkProps} from 'next/link'

export const makeServicePageLink: (info: {
  deepLink: string
  type?: HOME_SECTION_TYPE
  service: string
  superType?: string
  cityTitle?: string | null
  transform?: (params: URLSearchParams) => void
}) => LinkProps['href'] = ({
  deepLink,
  service,
  type,
  cityTitle,
  transform = () => {},
}) => {
  const searchParams = new URLSearchParams(deepLink?.split('?')[1])
  searchParams.delete('lat')
  searchParams.delete('long')
  searchParams.append('page', '0')
  transform(searchParams)
  const serviceString = String(service).toLowerCase()
  const getPathName = (type?: HOME_SECTION_TYPE) => {
    switch (type) {
      case HOME_SECTION_TYPE.CITIES:
        return `service/all/city/${serviceString}`
      case HOME_SECTION_TYPE.VENDORS:
        return `service/vendor-collection/${serviceString
          .split('-')
          .slice(1)
          .join('')}`
      case HOME_SECTION_TYPE.CUISINES:
        searchParams.delete('extraFilter')
        searchParams.append('section', 'SERVICES')
        searchParams.delete('mode')
        return cityTitle
          ? `service/restaurant/city/${cityTitle}/near`
          : `service/restaurant`
      case HOME_SECTION_TYPE.SPECIAL_PRODUCTS:
      default:
        return `${serviceString}`
    }
  }
  return {
    pathname: getPathName(type),
    search: searchParams.toString(),
  }
}

export const SUPER_TYPES: Record<string, number> = {
  cosmetic: 12,
  book: 13,
  fashion: 14,
  digital: 15,
}

export const getPathname = (
  nearExist: boolean,
  routerHasCityName: boolean,
  service: string,
  cityName?: string | null
) => {
  if (cityName && nearExist) {
    return `/service/${service}/city/${cityName}/near`
  } else if (cityName && routerHasCityName) {
    return `/service/${service}/city/${cityName}`
  } else if (cityName && !routerHasCityName) {
    return `/service/${service}/city/${cityName}/near`
  } else {
    return `/service/${service}`
  }
}

export function getRouteParams(deepLink: string): any {
  const linkSections = deepLink?.split('?') || []
  const routeSections = linkSections.length ? linkSections[0].split('/') : []
  const indexOfCity = routeSections.indexOf('city')
  const routeParams =
    indexOfCity !== -1 ? {city: routeSections[indexOfCity + 1]} : {}
  const searchParams = new URLSearchParams(linkSections[1])

  return {...routeParams, ...Object.fromEntries(searchParams.entries())}
}
