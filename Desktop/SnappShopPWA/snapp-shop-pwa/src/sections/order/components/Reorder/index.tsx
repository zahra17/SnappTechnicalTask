import {SimplePageComponent as SPC} from '@root/types'
import {Reorders} from '~order/types'
import {useTranslation} from 'react-i18next'
import {useRouter} from 'next/router'
import React, {useState} from 'react'
import {useReorder} from '@hooks/useBasket'
import ChooseAddressModal from '~order/components/ChooseAddressModal'
import {useSelector} from 'react-redux'
import {selectActiveAddressId} from '~growth/redux/location'
import Link from 'next/link'
import styled from 'styled-components'
import {rem} from 'polished'
import {FlexBox, Text, Button, PreorderIcon, RetryIcon} from '@sf/design-system'
import {VendorBaseModel} from '@schema/vendor'

const ReorderContainer = styled(FlexBox)`
  margin-top: ${rem(16)};
`
const ReorderCard = styled(FlexBox)`
  margin-right: ${({theme}) => theme.spacing[2]};
  padding: ${rem(12)} 0 ${rem(12)} ${({theme}) => theme.spacing[2]};
  border-bottom: ${rem(1)} solid ${({theme}) => theme.carbon.alphaLight};
`
const ReorderButtonContainer = styled(FlexBox)`
  margin-right: auto;
  margin-left: 0;
`

const TitleContainer = styled(FlexBox)`
  margin-right: ${({theme}) => theme.spacing[2]};
`
const AllOrdersButton = styled(Button)`
  bottom: 0;
  height: ${rem(60)};
  margin: ${rem(4)} auto 0;
`
const LogoContainer = styled(FlexBox)`
  width: ${({theme}) => theme.spacing[6]};
  height: ${({theme}) => theme.spacing[6]};
  cursor: pointer;
`
const VendorLogo = styled.img`
  width: 100%;
  height: 100%;
  border-radius: ${rem(4)};
`
const ReorderWrapper = styled.div`
  margin-top: ${rem(12)};
  border-top: ${rem(1)} solid ${({theme}) => theme.carbon.alphaMedium};
  border-right: ${rem(1)} solid ${({theme}) => theme.carbon.alphaMedium};
  border-left: ${rem(1)} solid ${({theme}) => theme.carbon.alphaMedium};
  border-radius: ${rem(12)} ${rem(12)} 0 0;

  > {
    &:last-child {
      border: 0;
    }
  }
`
const VendorTitle = styled(Text)`
  cursor: pointer;
`
const SubmitReorderButton = styled(Button)`
  height: ${rem(36)};

  > * {
    flex: none;
  }
`

const Reorder: SPC<{
  reorders?: Reorders[]
  setIsOpen: (open: boolean) => void
}> = ({reorders, setIsOpen}) => {
  const {t} = useTranslation()
  const router = useRouter()
  const [isAddressOpen, setIsAddressOpen] = useState(false)
  const [activeReorder, setActiveReorder] = useState<Reorders>({} as Reorders)
  const handleReorder = useReorder()
  const activeAddress = useSelector(selectActiveAddressId)

  const handleSubmitReorder = (reorder: Reorders) => {
    setActiveReorder(reorder)
    if (activeAddress == reorder.orderAddress.id) {
      handleReorder(reorder)
      setIsOpen(false)
    } else {
      setIsAddressOpen(true)
    }
  }
  const submitCurrentAddress = () => {
    handleReorder(activeReorder, activeAddress)
    setIsAddressOpen(false)
    setIsOpen(false)
  }
  const submitBasketAddress = () => {
    handleReorder(activeReorder, activeReorder.orderAddress.id)
    setIsAddressOpen(false)
    setIsOpen(false)
  }
  const goToOrderList = () => {
    router.push('/profile/orders')
    setIsOpen(false)
  }

  const getLink = (reorder: Reorders) => {
    const vendor = new VendorBaseModel(reorder)
    return vendor.getLink()
  }

  return (
    <ReorderContainer direction='column'>
      <Text
        colorName='carbon'
        colorWeight='light'
        scale='caption'
        weight='bold'
      >
        {t('order:reorderModal.reorders')}
      </Text>
      <ReorderWrapper>
        {reorders?.map((reorder, index) => {
          return (
            <ReorderCard key={index}>
              <Link
                href={`/${reorder.superTypeAlias.toLowerCase()}/menu/${
                  reorder.vendorCode
                }`}
              >
                <LogoContainer direction='column'>
                  <VendorLogo
                    src={reorder.vendorLogo}
                    alt='vendor-logo-reorder'
                  />
                </LogoContainer>
              </Link>
              <TitleContainer direction='column'>
                <Link
                  href={`/${reorder.superTypeAlias.toLowerCase()}/menu/${
                    reorder.vendorCode
                  }`}
                >
                  <VendorTitle scale='body' colorName='carbon' weight='bold'>
                    {reorder.vendorTitle}
                  </VendorTitle>
                </Link>
                <Text scale='caption' colorName='carbon'>
                  {reorder.date}
                </Text>
              </TitleContainer>
              <ReorderButtonContainer>
                <SubmitReorderButton
                  colorName='carbon'
                  appearance='ghost'
                  onClick={() => handleSubmitReorder(reorder)}
                >
                  <div>
                    <RetryIcon />
                  </div>

                  <Text scale='body' weight='bold' colorName='carbon'>
                    {t('order:reorderModal.reorderAction')}
                  </Text>
                </SubmitReorderButton>
              </ReorderButtonContainer>
            </ReorderCard>
          )
        })}
      </ReorderWrapper>
      <AllOrdersButton
        colorName='accent2'
        appearance='naked'
        onClick={goToOrderList}
        float
      >
        <PreorderIcon fill='var(--sf-accent2-main)' />

        <Text colorName='accent2' scale='body' weight='bold'>
          {t('order:reorderModal.seeAllOrders')}
        </Text>
      </AllOrdersButton>
      <ChooseAddressModal
        isAddressOpen={isAddressOpen}
        setIsAddressOpen={setIsAddressOpen}
        submitBasketAddress={submitBasketAddress}
        submitCurrentAddress={submitCurrentAddress}
      />
    </ReorderContainer>
  )
}
export default Reorder
