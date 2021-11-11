import React, {useEffect, useRef, useState} from 'react'
import {useSelector} from 'react-redux'
import Link from 'next/link'
import styled from 'styled-components'
import {useRouter} from 'next/router'
import {FlexBox, Text} from '@sf/design-system'
import {Anchor} from '@components/Anchor'
import {CITY_CODES} from '@utils'
import {Img} from '@components/Img'
import {User} from '@schema/user'
import {eventTypes} from '@schema/rudderStack'
import {selectUser} from '@slices/core'
import {useAppDispatch} from '@redux'
import {getCityCodeById} from '@utils'
import {useBreadcrumb} from '@contexts/Breadcrumb'
import {usePinnedLocationContext} from '@contexts/Map/PinnedLocation'
import {useRudderStack} from '@contexts/RudderStack'
import useSelectedCity from '@hooks/useSelectedCity'
import {
  selectActiveAddress,
  selectLocation,
  showModal,
} from '~growth/redux/location'

import {Service} from '~search/types'
import {UrlObject} from 'url'
import {getPathname} from '~search/utils'
import {services} from './constant'

const SHOW_PATHS = [
  '/',
  '/service/[service]',
  '/cuisine/[cuisine]',
  '/[service]',
  '/service/[service]/city/[cityName]',
  '/service/vendor-collection/[vc]',
  '/service/[service]/city/[cityName]/near',
  '/service/[service]/city/[cityName]/area/[areaName]',
  '/service/[service]/chain/[chainName]',
  '/search',
  '/search-vendors',
  '/products',
  '/orders/list',
]

const Services = styled(FlexBox).attrs({as: 'nav', justify: 'center'})`
  padding-top: ${({theme}) => theme.spacing[2]};

  > * {
    margin: 0 ${({theme}) => theme.spacing[4]};
  }
`
const ServiceItem = styled(FlexBox)<{isActive: boolean}>`
  padding-bottom: ${({theme}) => theme.spacing[2]};
  cursor: pointer;

  > :first-child {
    margin-bottom: ${({theme}) => theme.spacing[2]};
  }
`

let savedLink: UrlObject | null = null
let savedService: string | null = null

export const ServicesList: React.FC = () => {
  const shopServices = services()
  const router = useRouter()
  const servicesFetched = useRef(false)
  if (!SHOW_PATHS.includes(router.route)) return null
  const [cityName, setCityName] = useState<string | null>(null)
  const [nearExist, setNearExist] = useState<boolean>(
    router.route.toLowerCase().includes('near')
  )
  const dispatch = useAppDispatch()
  // const {services} = useSelector(selectServicesSlice)
  const {activeLocation} = useSelector(selectLocation)
  const {selectedCity} = useSelectedCity({})
  const user: User | null = useSelector(selectUser)
  const activeAddress = useSelector(selectActiveAddress)
  const [loadedServices, setLoadedServices] = useState<Service[] | null>(
    shopServices
  )
  const goToService = (url: UrlObject) => {
    router[router.query.service ? 'replace' : 'push'](url)
  }

  useEffect(() => {
    if (savedLink && Number(activeLocation.lat) !== -1) {
      goToService(savedLink)
      savedService = null
      savedLink = null
    }
  }, [activeLocation.lat, activeLocation.long, savedLink])

  useEffect(() => {
    if (user && activeAddress) {
      const city_code = getCityCodeById(String(activeAddress.city?.id))
      setCityName(city_code)
    }
  }, [user, activeAddress])

  const breadcrumb = useBreadcrumb()
  useEffect(() => {
    const activeService = shopServices.find(
      item => item.id === Number(router.query.superType)
    )
    breadcrumb.changeBreadcrumbState({
      serviceId: activeService?.id,
      serviceAliasType: router.query.service,
      isVendorDetail: false,
      vendorTitle: null,
      filters: router.query.filters,
      vendorCategory: router.query.service,
      sorts: router.query.sort,
    })
  }, [])

  const rudderStack = useRudderStack()

  useEffect(() => {
    if (router.query && router.query.cityName) {
      const city_name = String(router.query.cityName)
      const code = Object.keys(CITY_CODES).find(
        code =>
          code?.toLocaleLowerCase() === String(city_name).toLocaleLowerCase()
      )
      if (code) setCityName(city_name || null)
      else if (selectedCity && selectedCity.code) setCityName(selectedCity.code)
      else setCityName(null)
    }
  }, [router.query])

  useEffect(() => {
    if (selectedCity && selectedCity.code && !user)
      setCityName(selectedCity.code)
  }, [selectedCity])

  const {isCitySubmited, city} = usePinnedLocationContext()

  useEffect(() => {
    if (nearExist || !isCitySubmited) return
    setNearExist(true)
  }, [isCitySubmited])

  useEffect(() => {
    if (cityName && savedLink) {
      savedLink.pathname = `service/${savedService?.toLocaleLowerCase()}/city/${cityName}/near`
    }
  }, [cityName])

  const onServiceItemClicked = (e: any, service: Service) => {
    console.log('Service', service)
    const serviceName = service.superTypeAlias?.toLowerCase()
    const pathname = getPathname(
      nearExist,
      !!router.query['cityName'],
      serviceName
    )
    const route: UrlObject = {
      pathname,
      search: `page=0&superType=${service.id}&section=SERVICES()`,
    }
    if (Number(activeLocation.lat) === -1) {
      dispatch(showModal(true))
      savedLink = route

      rudderStack.eventTrigger({
        type: eventTypes.track,
        eventName: 'Home not logged-in super-type',
        payload: {
          name: service.title,
          super_type_id: service.id,
        },
      })
      return
    }

    goToService(route)

    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Header super-type',
      payload: {
        name: service.title,
        super_type_id: service.id,
      },
    })
  }

  // if services are null refetch services
  // const refetchServices = () => {
  //   dispatch(fetchServices({}))
  //   setLoadedServices(services)
  // }
  // useEffect(() => {
  //   setLoadedServices(services)
  // }, [services])

  useEffect(() => {
    if (
      loadedServices &&
      loadedServices.length < 1 &&
      !servicesFetched.current
    ) {
      servicesFetched.current = true
      // refetchServices()
    }
  }, [loadedServices])

  const onLocationLessServiceItemClicked = (
    service: Service,
    e: React.MouseEvent<HTMLElement>
  ) => {
    e.stopPropagation()
    e.preventDefault()
    dispatch(showModal(true))
    savedService = service.superTypeAlias
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Home not logged-in super-type',
      payload: {
        name: service.title,
        super_type_id: service.id,
      },
    })
  }
  return (
    <Services direction='row'>
      {loadedServices &&
        loadedServices.map((service, i) => {
          const serviceName = service.superTypeAlias?.toLowerCase()
          const pathname = getPathname(
            nearExist,
            !!router.query['cityName'],
            serviceName,
            cityName
          )
          const route: UrlObject = {
            pathname,
            search: `page=0&superType=${service.id}&section=SERVICES`,
          }
          const Component = (
            <ServiceItem
              direction='column'
              justify='center'
              alignItems='center'
              key={`service-${i}`}
              isActive={service.id === Number(router.query.superType)}
              onClick={e => onServiceItemClicked(e, service)}
            >
              <Img
                src={service.icon ? service.icon[0] : ''}
                alt={service.title}
                width='80'
                height='80'
              />
              <Text scale='caption' colorWeight='light' as='span'>
                {service.title}
              </Text>
            </ServiceItem>
          )

          return Number(activeLocation.lat) === -1 ? (
            <Link key={i} href={route} passHref prefetch={false}>
              <Anchor
                onClick={(e: React.MouseEvent<HTMLElement>) =>
                  onLocationLessServiceItemClicked(service, e)
                }
              >
                {Component}
              </Anchor>
            </Link>
          ) : (
            <Link key={i} href={route} passHref prefetch={false}>
              <Anchor title={service.title} tabIndex={i}>
                {Component}
              </Anchor>
            </Link>
          )
        })}
    </Services>
  )
}
