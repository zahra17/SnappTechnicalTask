import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {ListView} from '~search/components/ListView'
import {VendorCard} from '~search/components/VendorCard'
import {SectionItem} from '~search/components/SectionItem'
import {HOME_SECTION_TYPE, VendorCollectionType} from '~search/types'
import {LazySection} from '@components/LazySection'
import {useAppDispatch} from '@redux'
import {actions, fetchVendorCollection} from '~search/redux/home'
import {makeServicePageLink} from '~search/utils'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'
import {FetchParams} from '~search/redux/vendorsList'

interface Props {
  vendorCollection: VendorCollectionType
}

const VendorItem = styled(VendorCard)`
  height: ${rem(341)};
`

export const VendorCollection: React.FC<Props> = ({
  vendorCollection: {
    front_id,
    id,
    visible,
    title,
    data: {restaurants = []} = {},
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
          deepLink,
          service: front_id,
          type: HOME_SECTION_TYPE.VENDORS,
        }),
      }
    : undefined

  const rudderStack = useRudderStack()
  const [vendorCollectionTitle, setTitle] = useState(title)
  const onSectionVisible = () => {
    if (!visible) {
      if (!modern_render) {
        dispatch(actions.setSectionVisibility({id: front_id!, visible: true}))
      } else {
        const url = new URL(deepLink)
        url.searchParams.append('isVendorList', 'true')
        dispatch(
          fetchVendorCollection({
            id: front_id,
            ...Object.fromEntries(url.searchParams.entries()),
          })
        )
      }
    }

    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Promotion Viewed',
      payload: {
        promotion_id: id,
        creative: 'vendors',
        name: vendorCollectionTitle,
        position: 'home_middle',
      },
    })
  }
  const rudderStackTrigger = () => {
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Promotion Viewed',
      payload: {
        promotion_id: id,
        creative: 'vendors',
        name: vendorCollectionTitle,
        position: 'home_middle',
      },
    })
  }

  return (
    <LazySection
      key={front_id}
      visible={visible}
      onVisible={() => {
        onSectionVisible()
      }}
      rudderStackTrigger={rudderStackTrigger}
      preservedHeight='397px'
    >
      <SectionItem
        heading={title}
        promotionId={id}
        moreText='مشاهده همه'
        linkProps={linkProps}
        style={appearingStyles}
      >
        <ListView listId={front_id || String(id)} showMore={show_more}>
          {restaurants.map((vendor, idx) => (
            <VendorItem
              key={idx}
              vendor={vendor as any}
              isLoading={false}
              position={idx}
              promotionId={id}
              heading={title}
            />
          ))}
        </ListView>
      </SectionItem>
    </LazySection>
  )
}
