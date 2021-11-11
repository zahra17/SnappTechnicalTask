import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {useRouter} from 'next/router'
import styled from 'styled-components'
import {rem} from 'polished'
import {useTranslation} from 'react-i18next'
import {
  Modal,
  ModalBox,
  SearchIcon,
  CircleCloseIcon,
  Text,
  ChevronLeftIcon,
  FlexBox,
} from '@sf/design-system'
import {SearchInput} from '@components/SearchInput'
import {SearchBox} from '@components/SearchBox'
import {useCustomEvent} from '@hooks/useCustomEvent'

import {selectAppData} from '@slices/core'
import {StringParam, useQueryParams} from 'use-query-params'
import {getVendorCodeFromQuery, VendorBaseModel} from '@schema/vendor'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'

const ModalWrapper = styled(ModalBox)`
  position: fixed;
  top: 0;
  display: flex;
  justify-content: center;
  width: 32vw;
  margin: auto;
  padding: ${rem(12)} 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`
const Container = styled(FlexBox)`
  > *:last-child {
    margin-top: ${rem(30)};
  }
`

const SearchInputWrapper = styled.div`
  position: relative;

  > *:first-child {
    position: absolute;
    top: 0;
    right: ${rem(16)};
    bottom: 0;
    margin: auto;
    cursor: pointer;
  }
`
const SearchItem = styled(FlexBox)`
  cursor: pointer;
`

export const SEARCH_PLACE_HOLDER_EVENT = 'SEARCH_PLACE_HOLDER_EVENT'

export const SearchModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const {t} = useTranslation()
  const router = useRouter()

  const [queryParams] = useQueryParams({query: StringParam})

  const query = queryParams.query || ''

  const [term, setTerm] = useState(query)
  const {superTypes} = useSelector(selectAppData) || {
    superTypes: {},
  }

  const [placeHolderText, setPlaceHolderText] = useState(
    router.query.query ||
      t('search-placholder', {
        text: superTypes[Number(router.query.superType)] || t('snappfood'),
      })
  )

  const {vendorCode} = getVendorCodeFromQuery(router.query)

  useCustomEvent({
    typeArg: SEARCH_PLACE_HOLDER_EVENT,
    listener: e => {
      if (typeof e.detail === 'string') setPlaceHolderText(e.detail)
    },
  })
  const handleSubmit = () => {
    if (vendorCode) {
      setIsOpen(!isOpen)

      router.replace(VendorBaseModel.shopSearchLink(router, term))
    } else {
      setIsOpen(!isOpen)
      const superTypeParam =
        router.query.superType && `&superType=${router.query.superType}`
      const route = `/search?query=${term}${superTypeParam || ''}`
      if (router.route === '/search') {
        router.replace(route)
      } else {
        router.push(route)
      }
    }
  }
  useEffect(() => {
    setPlaceHolderText(
      router.query.query ||
        t('search-placholder', {
          text: superTypes[Number(router.query.superType)] || t('snappfood'),
        })
    )
    setTerm(query)
  }, [router.query, router.route])
  const rudderStack = useRudderStack()
  const onSearchBoxClicked = () => {
    setIsOpen(!isOpen)
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Home Header search click',
    })
  }
  const onSearchItemClicked = () => {
    if (term) {
      handleSubmit()
      rudderStack.eventTrigger({
        type: eventTypes.track,
        eventName: 'Products Searched',
        payload: {
          query: term,
        },
      })
    }
  }

  const onSearchInputKeyPress = (e: any) => {
    const keyCode = e.keyCode || e.which
    if (e.key === 'Enter' || keyCode === 13) {
      handleSubmit()
      if (term) {
        rudderStack.eventTrigger({
          type: eventTypes.track,
          eventName: 'Products Searched',
          payload: {
            query: term,
          },
        })
      }
    }
  }
  return (
    <>
      <SearchBox alignItems='center' onClick={onSearchBoxClicked}>
        <SearchIcon fill={'var(--sf-inactive-dark)'} />
        <Text scale='default' colorName='inactive' colorWeight='dark'>
          {placeHolderText}
        </Text>
      </SearchBox>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(!isOpen)}
        custom
        animation='fade'
        disableBodyScroll={false}
        backdropColor='var(--modal-backdrop)'
      >
        <ModalWrapper>
          <Container direction='column'>
            <SearchInputWrapper>
              {term ? (
                <CircleCloseIcon
                  onClick={() => {
                    setTerm('')
                    if (vendorCode) {
                      setIsOpen(!isOpen)
                      router.replace(VendorBaseModel.shopSearchLink(router, ''))
                    } else {
                      router.replace(`${router.pathname}?query=`)
                    }
                  }}
                  fill='var(--sf-inactive-dark)'
                />
              ) : (
                <SearchIcon />
              )}
              <SearchInput
                autoFocus
                value={term}
                onChange={e => {
                  const {value} = e.target
                  setTerm(value)
                }}
                onKeyDown={onSearchInputKeyPress}
              />
            </SearchInputWrapper>
            <SearchItem
              justify='space-between'
              alignItems='center'
              onClick={onSearchItemClicked}
            >
              {term ? (
                <Text scale='body' colorWeight='light' as='span'>
                  {t('beginning-text')}{' '}
                  <Text scale='body' weight='bold'>
                    {term}
                  </Text>
                </Text>
              ) : (
                <Text scale='body' colorWeight='light' as='span'>
                  {t('enter-your-term')}
                </Text>
              )}
              {Boolean(term) && <ChevronLeftIcon width='12' height='12' />}
            </SearchItem>
          </Container>
        </ModalWrapper>
      </Modal>
    </>
  )
}
