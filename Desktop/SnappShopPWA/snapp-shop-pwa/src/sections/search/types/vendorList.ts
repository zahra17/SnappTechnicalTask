import {Vendor} from '@schema/vendor'
type Dictionary = {[index: number]: string}
export const vendorTypes: Dictionary = {
  1: 'RESTAURANT',
  2: 'CAFFE',
  3: 'CONFECTIONERY',
  4: 'SUPERMARKET',
  5: 'BAKERY',
  6: 'GROCERY',
  7: 'NUTS',
  8: 'JUICE',
  9: 'OTHERS',
  10: '',
  11: 'PROTEIN',
  12: 'COSMETIC',
}
export type VendorListResponse = {
  status: boolean
  Status: boolean
  data: {
    finalResult: {data: Vendor; type: string}[]
    extra_sections: ExtraSection
    count: number
    open_count: number
  }
}

export interface Tag {
  image: string
  title: string
  single_choice?: boolean
  selected: boolean
  sub?: Array<Tag>
  value: number
}

export interface Filter {
  image: string
  kind: 'filters' | 'sortings'
  selected: boolean
  single_choice: boolean
  title: string
  value: string
}

export interface ExtraSection {
  categories: {
    data: Array<Tag>
  }
  filters: {
    sections: Array<{
      data: Array<Filter>
      section_name: string
      section_name_fa: string
    }>
    top: {
      data: Array<Filter>
    }
  }
}
