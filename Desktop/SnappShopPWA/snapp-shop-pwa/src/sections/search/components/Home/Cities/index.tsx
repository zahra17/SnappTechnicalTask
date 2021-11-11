import React, {useEffect} from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {Grid, Text} from '@sf/design-system'
import {useSelector} from 'react-redux'
import {getCities, selectCities} from '~search/redux/home'
import {useAppDispatch} from '@redux'
import {useTranslation} from 'react-i18next'
import Link from 'next/link'
import {Anchor} from '@components/Anchor'
import {makeServicePageLink} from '~search/utils'
import {HOME_SECTION_TYPE} from '~search/types'

const CitiesSection = styled.section`
  box-sizing: border-box;
  width: 100%;
  min-width: ${rem(1024)};
  padding: ${({theme}) => theme.spacing[4]};
  background-color: ${({theme}) => theme.surface.light};
  border-top: ${rem(1)} solid ${({theme}) => theme.surface.dark};
  /* Heading */
  > :first-child {
    margin-bottom: ${({theme}) => theme.spacing[4]};
  }
  /* Grid */
  > :last-child {
    /* Link */
    > * {
      cursor: pointer;
    }
  }
`
const City = styled(Grid)`
  padding: ${rem(3)};
`
export const Cities: React.FC = () => {
  const dispatch = useAppDispatch()
  const {t} = useTranslation()
  const {cities = [], deepLink = ''} = useSelector(selectCities) || {}

  useEffect(() => {
    if (!cities.length) {
      dispatch(getCities({}))
    }
  }, [])
  return (
    <CitiesSection>
      <Text as='h2' scale='default' weight='bold'>
        {t('search:home.cities-heading')}
      </Text>
      <Grid container spacing={1}>
        {cities.map((city, i) => (
          <City key={city.id} item xs={3} sm={2} md={1}>
            <Link
              passHref
              href={makeServicePageLink({
                deepLink: deepLink,
                type: HOME_SECTION_TYPE.CITIES,
                transform: params => {
                  const extraFiler = decodeURIComponent(
                    String(params.get('extraFilter'))
                  )
                  params.delete('extraFilter')
                  params.delete('mode')
                },
                service: city.english_title,
              })}
            >
              <Anchor title={city.title} tabIndex={i}>
                <Text
                  scale='tiny'
                  colorName='inactive'
                  colorWeight='dark'
                  align='center'
                >
                  {city.title}
                </Text>
              </Anchor>
            </Link>
          </City>
        ))}
      </Grid>
    </CitiesSection>
  )
}
