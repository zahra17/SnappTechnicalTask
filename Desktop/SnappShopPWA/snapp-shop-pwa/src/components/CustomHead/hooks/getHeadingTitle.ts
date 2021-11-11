import i18n from '@i18n'

export const getHeadingTitle = (
  type: string | null,
  cityTitle: string | null,
  area: string | null,
  tagTitle: string | null,
  serviceName: string | null,
  chainName: string | null
): string => {
  if (serviceName && String(serviceName).toLowerCase() === 'all') {
    return i18n.t('seo.heading.all_city', {cityTitle})
  }

  if (chainName) {
    return i18n.t('seo.heading.chain', {chainName})
  }
  if (!tagTitle && type) {
    const sp = i18n.t(`core:vendorTypes.${type}`)
    return i18n.t(
      `seo.heading.${sp && sp.toLowerCase()}${cityTitle ? '_city' : ''}${
        area ? '_area' : ''
      }`,
      {
        cityTitle,
        area,
      }
    )
  } else if (tagTitle) {
    // if (serviceName.toLowerCase() === 'chain') {
    // }

    const sp = i18n.t(`core:vendorTypes.${type}`)
    return i18n.t(
      `seo.heading.${sp && sp.toLowerCase()}_cuisine${
        cityTitle ? '_city' : ''
      }${area ? '_area' : ''}`,
      {
        cityTitle,
        area,
        tagTitle,
      }
    )
  } else {
    return ''
  }
}
