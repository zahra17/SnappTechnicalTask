import React, {useState, useRef, useEffect} from 'react'
import debounce from 'lodash/debounce'
import styled from 'styled-components'
import {rem} from 'polished'
import {SearchIcon, Text, Input, FlexBox} from '@sf/design-system'
// api

import SuggestionList from './SuggestionList'
import {
  CityLocation,
  SearchPlace,
  SearchPlaceResponse,
  Suggestion,
} from '@schema/location'
import {LatLong} from '@schema/location'
import {useTranslation} from 'react-i18next'
import requests from '~growth/endpoints'
import {isAPIResponse} from '@api'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'
import {usePinnedLocationContext} from '@contexts/Map/PinnedLocation'
import {useMapSearchBoxContext} from '@contexts/Map/Searchbox'

interface SearchProps {
  setMapLocation: (latLong: LatLong, justCenter: boolean, qText: string) => void
  defaultQText: string
  setIsOpenCities: (state: boolean) => void
  selectedCity?: CityLocation
}

const SearchBar = styled.section`
  position: absolute;
  z-index: 450;
  width: ${rem(608)};
  height: ${rem(48)};
  margin: 1rem;

  form {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: ${({theme}) => theme.shadows.medium};
  }
`
const SelectCity = styled(FlexBox)`
  margin-left: 1rem;
  padding: 0 1rem;
  font-family: 'IRANSansMobile', Arial, Helvetica, sans-serif;
  border-left: 1px solid var(--sf-surface-dark);
`
const InputSection = styled(FlexBox)`
  flex: 1;
`

const StyledInput = styled(Input)`
  width: 100%;
  border: 0;

  &:focus-within {
    border: 0;
  }

  input {
    font-size: ${rem(16)};
    font-family: 'IRANSansMobile', Arial, Helvetica, sans-serif;

    &::-webkit-search-cancel-button {
      display: none;
    }
  }
`

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: unset;
  border: unset;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`

const Search: React.FC<SearchProps> = ({
  setMapLocation,
  defaultQText,
  setIsOpenCities,
  selectedCity,
}: SearchProps) => {
  const [suggestList, setSuggestList] = useState<Suggestion[]>([])
  const [qText, setqText] = useState(defaultQText)
  const [isActive, setIsActive] = useState<boolean>(false)
  const rudderStack = useRudderStack()
  let delayTimeout: any
  const {t} = useTranslation()
  const pinnedLocationContext = usePinnedLocationContext()
  const inputRef = useRef<HTMLInputElement>(null)
  const [pinnedValue, setPinnedValue] = useState<string | undefined>('')
  useEffect(() => {
    submitSearch()
  }, [qText])

  async function submitSearch() {
    clearTimeout(delayTimeout)
    if (qText === defaultQText) return
    const apiParams = {
      lat: selectedCity?.latitude,
      lon: selectedCity?.longitude,
      place: qText,
    }

    try {
      const response = await requests.mapSearchPlace<SearchPlaceResponse>({
        params: {...apiParams},
      })

      if (isAPIResponse(response)) {
        const [{data, status}] = response.data
        if (status) {
          const mappedData: Suggestion[] = data.map(item => ({
            ...item,
            id: item.place_id,
            location: {
              lat: +item.location.latitude,
              long: +item.location.longitude,
            },
          }))
          setSuggestList(mappedData)
        } else throw 'err'
      } else throw 'err'
    } catch (error) {
      console.log(error)
    }
  }

  function handleClickSuggestion(id: string) {
    const suggest = suggestList.find((item: Suggestion) => item.id === id)
    if (suggest) {
      if (inputRef.current) {
        inputRef.current.value = suggest.name
      }
      setMapLocation(suggest.location, true, suggest.name)
      pinnedLocationContext.changeAddress({
        lat: suggest.location.lat,
        lon: suggest.location.long,
        address: suggest.name,
      })
    }
  }

  function handleForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    submitSearch()
  }

  function handleCloseSuggestion() {
    setTimeout(() => {
      setIsActive(false)
    }, 300)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      suggestList.length && handleClickSuggestion(suggestList[0].id)
    }
  }
  const onInputKeyPress = (e: any) => {
    const keyCode = e.keyCode || e.which
    if (e.key === 'Enter' || keyCode === 13) {
      rudderStack.eventTrigger({
        type: eventTypes.track,
        eventName: 'Searched neighborhood',
        payload: {
          query: inputRef.current?.value ?? '',
        },
      })
    }
  }
  const onSelectCityClicked = () => {
    setIsOpenCities(true)
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Address Select City click',
    })
  }
  useEffect(() => {
    if (
      inputRef.current &&
      pinnedLocationContext.addressDetails?.trim() !== ''
    ) {
      inputRef.current.value = pinnedLocationContext.addressDetails
      setPinnedValue(inputRef.current.value)
    }
  }, [pinnedLocationContext])

  const {changeState} = useMapSearchBoxContext()
  const onInputSectionFocus = () => {
    setIsActive(true)
    if (inputRef.current && inputRef.current.value === pinnedValue)
      inputRef.current.value = ''
  }
  return (
    <SearchBar>
      <form onSubmit={handleForm}>
        <SelectCity
          alignItems='center'
          justify='center'
          onClick={onSelectCityClicked}
        >
          <Text scale='default' weight='bold'>
            {selectedCity?.title}
          </Text>
        </SelectCity>
        <InputSection
          alignItems='center'
          justify='flex-start'
          onFocus={() => changeState(true)}
          onBlur={() => changeState(false)}
        >
          <StyledInput
            value={qText}
            defaultValue={qText}
            ref={inputRef}
            type='search'
            placeholder={t('core:location.map.searchArea')}
            onChange={e => setqText(e.target.value)}
            onFocus={debounce(() => onInputSectionFocus(), 50)}
            // onBlur={debounce(() => handleCloseSuggestion(), 50)}
            onKeyDown={handleKeyDown}
            onKeyPress={onInputKeyPress}
          />
        </InputSection>

        <SearchButton type='submit'>
          <SearchIcon fill='var(--sf-carbon-alphaHigh)' />
        </SearchButton>
      </form>

      <SuggestionList
        isActive={isActive}
        suggestList={suggestList}
        onClick={handleClickSuggestion}
      />
    </SearchBar>
  )
}

export default React.memo(Search)
