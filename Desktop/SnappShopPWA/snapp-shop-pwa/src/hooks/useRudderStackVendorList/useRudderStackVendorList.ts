import {useRudderStack} from '@contexts/RudderStack'
import {Vendor, VendorModel} from '@schema/vendor'
import {useEffect} from 'react'
import {eventTypes} from '@schema/rudderStack'
import {Filter, Tag, vendorTypes} from '~search/types/vendorList'
interface FiltersInRudderStack {
  type: string
  value: string
}
interface Props {
  query: {
    superType: (number | null)[] | null | undefined
    sort: (string | null)[] | null | undefined
    services: (string | null)[] | null | undefined
  }
  list: Vendor[]
  categoriesArray: Tag[]
  filters: {
    sections: {
      data: Filter[]
      section_name: string
      section_name_fa: string
    }[]
    top: {
      data: Filter[]
    }
  }
}
export function useRudderStackVendorList(props: Props) {
  const {query, list, categoriesArray, filters} = props
  const rudderStack = useRudderStack()
  useEffect(() => {
    if (list.length === 0) return

    //Filters
    const allFilters: FiltersInRudderStack[] = []
    const selectedCategory = categoriesArray.find(item => item.selected)
    const selectedCategoryTitle = selectedCategory ? selectedCategory.title : ''
    const superTypeNumber: number =
      query.superType && query.superType[0] ? query.superType[0] : 0
    const selectedFilters = filters.sections.filter(
      item => item.data.filter(d => d.selected).length > 0
    )
    const selectedSubType = selectedCategory?.sub?.find(
      (item: {selected: boolean}) => item.selected
    )
    const superTypeName =
      query.superType && vendorTypes[superTypeNumber]
        ? vendorTypes[superTypeNumber]
        : query.services
        ? query.services[0]
        : undefined
    const standardizedSelectedSuperType: FiltersInRudderStack = {
      type: 'super_type',
      value: superTypeName || '',
    }
    if (query.superType) allFilters.push(standardizedSelectedSuperType)
    const standardizedSelectedCategory: FiltersInRudderStack = {
      type: 'category',
      value: String(selectedCategory?.title),
    }
    if (selectedCategory) allFilters.push(standardizedSelectedCategory)
    const standardizedSelectedSubType: FiltersInRudderStack = {
      type: 'sub_type',
      value: String(selectedSubType?.title) || '',
    }
    if (selectedSubType) allFilters.push(standardizedSelectedSuperType)
    selectedFilters.forEach(item => {
      const data = item.data
        .filter(i => i.selected)
        .map(
          (i): FiltersInRudderStack => ({
            type: item.section_name,
            value: i.value,
          })
        )
      allFilters.push(...data)
    })
    const category_title =
      selectedCategoryTitle && selectedCategoryTitle !== ''
        ? selectedCategoryTitle
        : vendorTypes[superTypeNumber]
    if (allFilters.length > 0) {
      rudderStack.eventTrigger({
        type: eventTypes.track,
        eventName: 'Vendor List Filtered',
        payload: {
          list_id: superTypeNumber ?? -1,
          category: category_title,
          filters: allFilters,
          sorts: query.sort?.map(item => ({
            type: superTypeName,
            value: item,
          })),
          vendors: list.map((item, index) => {
            const path = new VendorModel(item)
            return {
              vendor_id: item.id,
              name: item.title,
              delivery_price: item.deliveryFee,
              discount: item.discountValueForView,
              position: index,
              category: category_title,
              url: Object(path.getLink()).pathname,
              image_url: item.backgroundImage,
            }
          }),
        },
      })
    } else {
      rudderStack.eventTrigger({
        type: eventTypes.track,
        eventName: 'Vendor List View',
        payload: {
          list_id: superTypeNumber ?? -1,
          category: category_title,
          vendors: list.map((item, index) => {
            const path = new VendorModel(item)
            return {
              vendor_id: item.id,
              name: item.title,
              delivery_price: item.deliveryFee,
              position: index,
              discount: item.discountValueForView,
              category: category_title,
              url: Object(path.getLink()).pathname,
              image_url: item.backgroundImage,
            }
          }),
        },
      })
    }

    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Vendor List Filtered',
      payload: {
        list_id: superTypeName,
        category: selectedCategoryTitle,
        filters: allFilters,
        sorts: query.sort?.map(item => ({
          type: superTypeName,
          value: item,
        })),
        vendors: list.map((item, index) => {
          const path = new VendorModel(item)
          return {
            vendor_id: item.id,
            name: item.title,
            delivery_price: item.deliveryFee,
            position: index,
            category: selectedCategoryTitle,
            url: path.getLink(),
            image_url: item.backgroundImage,
          }
        }),
      },
    })
  }, [rudderStack, list])
}
