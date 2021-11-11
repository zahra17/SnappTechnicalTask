import {useRouteMap} from '@components/Breadcrumb/routeMap'
import React, {createContext, useContext, useState} from 'react'
import {IBreadcrumb} from '~search/types/breadcrumb'

export interface BreadcrumbState {
  serviceAliasType?: string
  serviceId?: number
  isVendorDetail: boolean
  vendorTitle?: string | null
  filters?: string | null
  sorts?: string | null
  vendorCategory?: string | null
}

const init: BreadcrumbState = {
  serviceAliasType: undefined,
  serviceId: undefined,
  isVendorDetail: false,
  vendorTitle: null,
  filters: null,
  sorts: null,
  vendorCategory: null,
}

interface BreadcrubmContextState {
  changeBreadcrumbState: Function
  crumbs: (IBreadcrumb | undefined)[]
}
const BreadcrumbContext = createContext<BreadcrubmContextState>({
  changeBreadcrumbState: () => {},
  crumbs: [],
})

const BreadcrumbProvider: React.FC = ({children}) => {
  const routeMap = useRouteMap()
  const [breadcrumbs, setBreadcrumbs] = useState<(IBreadcrumb | undefined)[]>(
    []
  )
  const changeBreadcrumbState = (state: BreadcrumbState = init) => {
    const {
      serviceAliasType,
      serviceId,
      isVendorDetail = false,
      vendorTitle,
      filters,
      sorts,
      vendorCategory,
    } = state
    const arr = []
    const base = routeMap.find(item => item.path === '/')
    arr.push(base)
    const serviceRouteData = serviceAliasType
      ? routeMap.find(
          item => item.serviceAliasType === serviceAliasType.toLowerCase()
        )
      : serviceId
      ? routeMap.find(item => item.superType === serviceId)
      : filters
      ? routeMap.find(item => item.filters === filters)
      : sorts
      ? routeMap.find(item => item.sorts === sorts)
      : vendorCategory
      ? routeMap.find(item => item.filters === vendorCategory)
      : null
    arr.push({
      path: serviceRouteData?.path,
      title: serviceRouteData?.title,
      superType: serviceId,
    })
    if (isVendorDetail) {
      arr.push({
        path: null,
        title: vendorTitle ?? undefined,
        serviceAliasType: serviceAliasType,
        superType: 0,
      })
    }
    setBreadcrumbs(arr)
  }

  return (
    <BreadcrumbContext.Provider
      value={{changeBreadcrumbState, crumbs: breadcrumbs}}
    >
      {children}
    </BreadcrumbContext.Provider>
  )
}

export const useBreadcrumb = () => {
  return useContext(BreadcrumbContext)
}

export default BreadcrumbProvider
