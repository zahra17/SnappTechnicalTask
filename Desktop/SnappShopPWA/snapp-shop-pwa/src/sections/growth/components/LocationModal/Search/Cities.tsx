import React, {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import styled from 'styled-components'
import {Modal, Input, FlexBox, Text, SearchIcon} from '@sf/design-system'
import {useCities} from '~growth/hooks/useCities'
import {CityLocation} from '@schema/location'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'

interface CitiesProps {
  isOpenCities: boolean
  setIsOpenCities: (state: boolean) => void
  handleSelectCity: (city: CityLocation) => void
}

const Layout = styled.section`
  padding: 0.7rem;
`
const CitiesWrapper = styled.section`
  height: 10rem;
  overflow-y: auto;
`
const Item = styled(FlexBox)`
  height: 3rem;
  border-bottom: 1px solid ${({theme}) => theme.carbon.alphaLight};
  cursor: pointer;
  user-select: none;
`
const InputWrapper = styled(FlexBox)`
  position: relative;
  margin-bottom: 0.5rem;
`
const StyledSearchIcon = styled(SearchIcon)`
  position: absolute;
  top: 1rem;
  right: 0.75rem;
`
const StyledInput = styled(Input)`
  width: 100%;
  border: 1px solid ${({theme}) => theme.carbon.alphaLight} !important;
  border-radius: 10px;

  input {
    text-indent: 1.75rem;
  }
`

const Cities: React.FC<CitiesProps> = ({
  isOpenCities,
  setIsOpenCities,
  handleSelectCity,
}: CitiesProps) => {
  const {t} = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [qCity, setQCity] = useState('')
  const cities = useCities()
  const filteredCities: Array<CityLocation> = qCity
    ? cities.filter((item: CityLocation) => item.title?.includes(qCity))
    : cities

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      filteredCities.length && handleSelectCity(filteredCities[0])
    }
  }

  useEffect(() => {
    if (isOpenCities && inputRef) {
      inputRef.current?.focus()
    }
  }, [isOpenCities])

  const rudderStack = useRudderStack()
  const onCityItemClicked = (city: CityLocation) => {
    handleSelectCity(city)
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Address Select City selection',
      payload: {
        name: city.title,
      },
    })
  }
  return (
    <Modal
      isOpen={isOpenCities}
      onClose={() => setIsOpenCities(false)}
      animation={'slideDown'}
      style={{width: '400px'}}
      backdropColor='var(--modal-backdrop)'
    >
      <Layout>
        <InputWrapper>
          <StyledSearchIcon />
          <StyledInput
            ref={inputRef}
            placeholder={t('core:location.map.searchCityName')}
            value={qCity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQCity(e.target.value)
            }
            onKeyDown={handleKeyDown}
          />
        </InputWrapper>
        <CitiesWrapper>
          {filteredCities?.map((city: CityLocation) => (
            <Item
              key={city.id}
              alignItems='center'
              onClick={() => onCityItemClicked(city)}
            >
              <Text colorName='carbon' weight='bold' scale='default'>
                {city.title}
              </Text>
            </Item>
          ))}
        </CitiesWrapper>
      </Layout>
    </Modal>
  )
}

export default React.memo(Cities)
