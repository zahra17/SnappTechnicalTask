import {sanitizeTitle, getVendorType, getVendorCodeFromQuery} from './vendor'

describe('Test sanitize Title function', () => {
  it('Should return sanitize Title', () => {
    const title = 'پیتزا پیتزا'
    expect(sanitizeTitle(title)).toBe('پیتزا_پیتزا')
  })

  it('Should handle undefined', () => {
    expect(sanitizeTitle()).toBe('')
  })
})

describe('Test vendor type function', () => {
  test.each([
    [
      {
        childType: 'RESTAURANT',
      },
      'r',
    ],
    [
      {
        childType: 'SUPERMARKET',
      },
      'z',
    ],
    [
      {
        childType: 'SUPERMARKET_TEST',
      },
      'z',
    ],
    [
      {
        childType: 'DIGITAL',
        is_ecommerce: true,
      },
      's',
    ],
    [
      {
        childType: 'DIGITAL',
      },
      's',
    ],
    [
      {
        childType: 'COSMETIC',
      },
      's',
    ],
    [
      {
        childType: 'BOOK',
      },
      's',
    ],
  ])('%o => %s', (input, result) => {
    expect(getVendorType(input)).toBe(result)
  })
})

describe('Test get vendor code from getVendorCodeFromQuery function', () => {
  it('Should return correct vendor code with new URL', () => {
    const query = {
      vendorInfo: 'سنگک_گلبرگ-r-p8gd15',
    }
    expect(getVendorCodeFromQuery(query)).toEqual({
      vendorCode: 'p8gd15',
      isOldUrl: false,
    })
  })

  it('Should return correct vendor code with old URL', () => {
    const query = {
      vendorInfo: 'p8gd15',
    }
    expect(getVendorCodeFromQuery(query)).toEqual({
      vendorCode: 'p8gd15',
      isOldUrl: true,
    })
  })
})
