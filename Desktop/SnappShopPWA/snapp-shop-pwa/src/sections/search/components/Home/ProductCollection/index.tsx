import React, {useCallback} from 'react'
import {LazySection} from '@components/LazySection'
import {ListView} from '~search/components/ListView'
import {SectionItem} from '~search/components/SectionItem'
import {ProductCard} from '~search/components/ProductCard'

import {HOME_SECTION_TYPE, ProductCollectionType} from '~search/types'
import {actions, fetchProductCollection} from '~search/redux/home'

import {useAppDispatch} from '@redux'
import {makeServicePageLink} from '~search/utils'

interface Props {
  productCollection: ProductCollectionType
}

export const ProductCollection: React.FC<Props> = ({
  productCollection: {
    front_id,
    id,
    visible,
    title,
    data: {products = []} = {},
    deepLink = '',
    show_more,
    modern_render,
  },
}) => {
  const dispatch = useAppDispatch()

  const appearingStyles = {
    opacity: visible ? '1' : '0',
    transition: 'opacity 0.7s cubic-bezier(0.5, 0, 0, 1) 0s',
  }

  const linkProps = show_more
    ? {
        href: makeServicePageLink({
          deepLink: deepLink + '&product_list=true',
          service: 'products',
          type: HOME_SECTION_TYPE.SPECIAL_PRODUCTS,
        }),
      }
    : undefined

  const onSectionVisible = useCallback(() => {
    if (!visible) {
      dispatch(actions.setSectionVisibility({id: front_id!, visible: true}))
      if (modern_render) {
        const url = new URL(deepLink)
        dispatch(
          fetchProductCollection({
            id: front_id,
            ...Object.fromEntries(url.searchParams.entries()),
          })
        )
      }
    }
  }, [])

  return (
    <LazySection
      key={front_id}
      visible={visible}
      onVisible={() => {
        onSectionVisible()
      }}
      preservedHeight='397px'
    >
      {products.length > 0 && (
        <SectionItem
          heading={title}
          promotionId={id}
          moreText='مشاهده همه'
          linkProps={linkProps}
          style={appearingStyles}
        >
          <ListView listId={front_id || String(id)} showMore={show_more}>
            {products?.map(product => (
              <ProductCard product={product} key={product.id} />
            ))}
          </ListView>
        </SectionItem>
      )}
    </LazySection>
  )
}
