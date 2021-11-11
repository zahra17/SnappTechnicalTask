import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import styled from 'styled-components'
import {rem} from 'polished'
import {
  PinIcon,
  Text,
  ChevronDownIcon,
  LocationIcon,
  FlexBox,
} from '@sf/design-system'
import {useDispatch} from 'react-redux'
import {setActive as setActiveAction} from '~growth/redux/location'
interface AddressCardProps {
  onClick: (e: React.FormEvent<HTMLElement>) => void
  isArea: boolean
  label?: string
  address?: string
}

const Layout = styled(FlexBox)`
  height: ${rem(40)};
  padding: ${rem(4)};
  cursor: pointer;

  > * {
    margin-left: ${rem(10)};
  }
`
const AddressString = styled(Text)`
  max-width: calc(26vw - 85px);
  padding-top: ${rem(2)};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.6;
`

const AddressCard: React.FC<AddressCardProps> = ({
  onClick,
  isArea,
  label,
  address,
}: AddressCardProps) => {
  const {t} = useTranslation()
  const [addressDetail, setAddressDetail] = useState(address)
  // dispatch
  const dispatch = useDispatch()
  useEffect(() => {
    if (!address) {
      const savedAddress = localStorage.getItem('addressDetails')
      if (savedAddress) {
        const savedAddressObj = JSON.parse(savedAddress || '{}')
        setAddressDetail(savedAddressObj.address)
        dispatch(
          setActiveAction({
            id: '',
            latitude: String(savedAddressObj.lat),
            longitude: String(savedAddressObj.long),
            address: savedAddressObj.address,
            mode: savedAddressObj.mode,
          })
        )
      }
    } else setAddressDetail(address)
  }, [address])
  return (
    <Layout inline alignItems='center' onClick={onClick}>
      {!isArea ? (
        <PinIcon />
      ) : (
        <LocationIcon
          fill='var(--sf-carbon-alphaHigh)'
          height='23px'
          width='23px'
        />
      )}
      <FlexBox direction='column'>
        <Text scale='body' weight='bold'>
          {!isArea ? label : t('core:location.aroundMe')}
        </Text>

        <FlexBox justify='center'>
          <AddressString
            colorName='carbon'
            colorWeight='main'
            scale='tiny'
            as='span'
          >
            {addressDetail}
          </AddressString>
          <ChevronDownIcon
            fill='var(--sf-accent-main)'
            style={{marginRight: '0.6rem', marginTop: '4px', width: '12px'}}
          />
        </FlexBox>
      </FlexBox>
    </Layout>
  )
}

export default React.memo(AddressCard)
