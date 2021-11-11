import React, {useState} from 'react'
import {rem} from 'polished'
import {useTranslation} from 'react-i18next'
import {
  CloseIcon,
  // HeartIcon,
  FlexBox,
  Text,
  PinIcon,
  TimeIcon,
  ChevronDownIcon,
  PaymentIcon,
  ShopCardIcon,
  Button,
  ChevronLeftIcon,
  Price,
  Modal,
  ChevronUpIcon,
} from '@sf/design-system'
import styled from 'styled-components'
import {SortedSchedules, VendorModel} from '@schema/vendor'
import {Img} from '@components/Img'
import Map from '@components/Map'
import Marker from '@components/Map/Marker'
import {ModalHeader} from '@components/ModalTools'
import VendorShifts from './VendorShifts'
import {useVendorIsOpen} from '@hooks/useVendorIsOpen'

interface Props {
  vendorModel: VendorModel
  handleClose: (...args: unknown[]) => void
  isMapModalOpen: boolean
  setIsMapModalOpen: (data: boolean) => void
  shifts: SortedSchedules[]
}

const TopBar = styled(FlexBox)`
  padding: ${rem(22)} ${rem(26)};
`
const Information = styled(FlexBox)`
  padding: ${({theme}) => theme.spacing[2]};
  padding-top: 0;
`
const RestaurantAvatar = styled(Img)`
  width: ${rem(96)};
  height: ${rem(96)};
  margin-left: ${rem(20)};
  border-radius: ${rem(12)};
  box-shadow: ${({theme}) => theme.shadows.high};
`
const TitleSection = styled(FlexBox)`
  * {
    margin-bottom: ${rem(4)};

    &:last-child {
      &:first-child {
        position: relative;
        top: ${rem(6)};
        margin-left: ${rem(5)};
        fill-opacity: 1;
        fill: ${({theme}) => theme.inactive.dark};
      }
    }
  }
`

const MapSection = styled.section`
  min-width: ${rem(184)};
  height: ${rem(96)};
  overflow: hidden;
  background-color: #80808040;
  border-radius: ${({theme}) => theme.spacing[1]};

  > Button {
    margin: ${rem(20)} auto;

    > * {
      &:last-child {
        fill: ${({theme}) => theme.accent2.main};
      }
    }

    &::after {
      position: relative;
      top: ${rem(28)};
      left: 50%;
      width: ${rem(2)};
      height: ${rem(18)};
      background-color: ${({theme}) => theme.carbon.dark};
      border-radius: 0 0 ${rem(1)} ${rem(1)};
      content: '';
    }

    &::before {
      position: relative;
      top: ${rem(36)};
      right: calc(50% - ${rem(6)}); /* {(32px + 10px) / 2} */
      width: ${rem(10)};
      height: ${rem(10)};
      background-color: ${({theme}) => theme.carbon.dark};
      border-radius: 100%;
      opacity: 0.1;
      content: '';
    }
  }
`
const MapOverlay = styled(FlexBox)`
  position: absolute;
  z-index: 400;
  width: 100%;
  height: 100%;

  > Button {
    margin: 0.6rem auto 0;

    > * {
      &:last-child {
        fill: ${({theme}) => theme.accent2.main};
      }
    }
  }
`
const CardsContainer = styled(FlexBox)`
  margin: ${({theme}) => theme.spacing[1]} 0;
`
const CardInformation = styled(FlexBox)`
  > {
    &:nth-child(2) {
      margin: ${rem(10)} 0 ${rem(4)};
    }
  }

  &:first-child {
    > {
      &:last-child {
        > {
          &:last-child {
            position: relative;
            top: ${rem(1)};
            width: ${rem(11)};
            margin-right: ${rem(4)};
          }
        }
      }
    }
  }
`

export const VendorDetailHeader: React.FC<Props> = ({
  vendorModel,
  handleClose = () => {},
  isMapModalOpen,
  setIsMapModalOpen,
  shifts,
}) => {
  const [isVisibleShifts, setIsVisibleShift] = useState(false)
  const {vendor} = vendorModel
  const {t} = useTranslation()
  const vendorIsOpen = useVendorIsOpen({vendorModel})

  return (
    <div>
      <TopBar justify='space-between'>
        <CloseIcon onClick={handleClose} />
        {/* <HeartIcon /> */}
      </TopBar>

      <Information justify='space-between'>
        <FlexBox>
          <RestaurantAvatar src={vendor.logo} alt={vendor.title} />
          <TitleSection direction='column' justify='center'>
            <Text scale='xlarge' weight='bold'>
              {vendor.title}
            </Text>
            <Text scale='body'>{vendor.tagNames?.join(', ')}</Text>
            <Text scale='caption' colorWeight='light'>
              <PinIcon />
              {vendor.address}
            </Text>
          </TitleSection>
        </FlexBox>
        <MapSection onClick={() => setIsMapModalOpen(true)}>
          <Map
            zoomControl={false}
            center={[vendor.lat + 0.002, vendor.lon]}
            height={rem(96)}
            width={rem(184)}
            hideSign
            dragging={false}
          >
            <Marker position={{lat: vendor.lat, lng: vendor.lon}} />
            <MapOverlay justify='center'>
              <Button
                dir='rtl'
                colorName='accent2'
                appearance='outline'
                float
                onClick={() => console.log('on map clicked')}
              >
                <Text scale='body' colorName='inherit' weight='bold'>
                  {t('show-on-map')}
                </Text>
                <ChevronLeftIcon />
              </Button>
            </MapOverlay>
          </Map>
        </MapSection>
      </Information>

      <CardsContainer justify='space-around'>
        <CardInformation
          direction='column'
          alignItems='center'
          onClick={() => setIsVisibleShift((state: boolean) => !state)}
        >
          <TimeIcon />
          <Text scale='caption'>{t('menu:vendorInfo.workingHours')}</Text>
          <Text scale='caption' weight='bold'>
            <Text
              scale='caption'
              weight='bold'
              colorName={vendorIsOpen ? 'accent2' : 'alert'}
              as='span'
            >
              {vendorIsOpen
                ? t('menu:vendorInfo.open')
                : t('menu:vendorInfo.close')}
            </Text>{' '}
            {vendorIsOpen
              ? vendorModel.getTodaySchedule()
              : vendorModel.findSchedules()}
            {isVisibleShifts ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Text>
        </CardInformation>
        <CardInformation direction='column' alignItems='center'>
          <PaymentIcon />
          <Text scale='caption'>{t('menu:vendorInfo.payment-methods')}</Text>
          <Text scale='caption' weight='bold'>
            {t('menu:vendorInfo.oneline-cash')}
          </Text>
        </CardInformation>
        <CardInformation direction='column' alignItems='center'>
          <ShopCardIcon />
          <Text scale='caption'>{t('menu:vendorInfo.minimum-basket')}</Text>
          {vendor.minOrder ? (
            <Price value={vendor.minOrder} />
          ) : (
            <Text scale='caption' weight='bold'>
              {t('menu:vendorInfo.no-minOrder')}
            </Text>
          )}
        </CardInformation>
      </CardsContainer>

      <VendorShifts shifts={shifts} isVisible={isVisibleShifts} />

      <Modal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        style={{width: '640px'}}
        backdropColor='var(--modal-backdrop)'
      >
        <ModalHeader
          title={vendor.title}
          onClose={() => setIsMapModalOpen(false)}
        />
        <Map center={[vendor.lat, vendor.lon]} height='60vh'>
          <Marker position={{lat: vendor.lat, lng: vendor.lon}} />
        </Map>
      </Modal>
    </div>
  )
}

export default React.memo(VendorDetailHeader)
