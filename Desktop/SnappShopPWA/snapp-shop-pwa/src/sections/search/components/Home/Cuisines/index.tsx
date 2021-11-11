import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import styled from 'styled-components'
import {Grid, FlexBox, Text} from '@sf/design-system'
import {Cuisines, HOME_SECTION_TYPE} from '~search/types'
import {CuisineItem} from '~search/components/Home/Cuisines/Cuisine'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {makeServicePageLink} from '~search/utils'
import {selectLocation, showModal} from '~growth/redux/location'
import {useAppDispatch} from '@redux'
import {LinkProps} from 'next/link'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'
import {useTranslation} from 'react-i18next'
import {Anchor} from '@components/Anchor'
import useSelectedCity from '@hooks/useSelectedCity'
import {usePinnedLocationContext} from '@contexts/Map/PinnedLocation'
interface Props {
  cuisines: Cuisines
}

let savedLink: LinkProps['href'] = ''

const Heading = styled(Text)`
  margin-bottom: ${({theme}) => theme.spacing[2]};
`
export const CuisinesSection: React.FC<Props> = ({cuisines}) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const {activeLocation} = useSelector(selectLocation)
  const {selectedCity} = useSelectedCity({})
  const [cityCode, setCityCode] = useState<string | null>(null)
  const rudderStack = useRudderStack()
  const {isCitySubmited, city} = usePinnedLocationContext()
  const {t} = useTranslation()
  useEffect(() => {
    if (savedLink && Number(activeLocation.lat) !== -1) {
      router.push(savedLink)
      savedLink = ''
    }
  }, [activeLocation.lat, activeLocation.long, savedLink])

  useEffect(() => {
    if (selectedCity?.code) setCityCode(selectedCity.code)
  }, [selectedCity])
  return (
    <FlexBox direction='column'>
      <Heading
        scale='default'
        colorName='carbon'
        colorWeight='light'
        weight='bold'
      >
        {t('cuisine_categories')}
      </Heading>
      <Grid container spacing={4}>
        {cuisines.data?.cuisines.map(cuisine => {
          const {deepLink} = cuisine

          const route = makeServicePageLink({
            deepLink,
            type: HOME_SECTION_TYPE.CUISINES,
            service: `cuisine-${cuisine.id}`,
            cityTitle: cityCode,
          })

          const handleClick = (
            e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
          ) => {
            const route = makeServicePageLink({
              deepLink,
              type: HOME_SECTION_TYPE.CUISINES,
              service: `cuisine-${cuisine.id}`,
              cityTitle: cityCode,
            })
            rudderStack.eventTrigger({
              type: eventTypes.track,
              eventName: 'Home cuisines',
              payload: {
                name: cuisine.title,
              },
            })
            if (Number(activeLocation.lat) === -1) {
              dispatch(showModal(true))
              savedLink = route
            } else {
              router.push(route)
            }

            if (Number(activeLocation.lat) === -1) {
              e.stopPropagation()
              e.preventDefault()
              return false
            }
          }
          const Content = (
            <Anchor title={cuisine.title} onClick={e => handleClick(e)}>
              <CuisineItem cuisine={cuisine} />
            </Anchor>
          )
          return (
            <Grid key={cuisine.id} item xs={3} sm={3} md={2} lg={2}>
              {Number(activeLocation.lat) === -1 ? (
                <Link href={route} passHref>
                  {Content}
                </Link>
              ) : (
                <Link href={route} passHref>
                  {Content}
                </Link>
              )}
            </Grid>
          )
        })}
      </Grid>
    </FlexBox>
  )
}
