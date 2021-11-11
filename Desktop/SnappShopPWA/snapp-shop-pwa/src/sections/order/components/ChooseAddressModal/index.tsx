import {Button, Grid, Modal, Text} from '@sf/design-system'
import React from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {useTranslation} from 'react-i18next'
import {SimplePageComponent as SPC} from '@root/types'

const ButtonsContainer = styled(Grid)`
  margin: ${({theme}) => theme.spacing[2]} 0;
`
const BillContainer = styled(Grid)`
  padding-left: ${({theme}) => theme.spacing[1]};
`
const FollowUpContainer = styled(Grid)`
  padding-right: ${({theme}) => theme.spacing[1]};
`
const ReorderAddressModal = styled(Modal)`
  width: ${rem(400)};
  padding: ${({theme}) => theme.spacing[4]} ${({theme}) => theme.spacing[2]} 0;
`
const ChooseAddressModal: SPC<{
  isAddressOpen: boolean
  setIsAddressOpen: (open: boolean) => void
  submitCurrentAddress: () => void
  submitBasketAddress: () => void
}> = ({
  isAddressOpen,
  setIsAddressOpen,
  submitCurrentAddress,
  submitBasketAddress,
}) => {
  const {t} = useTranslation()
  return (
    <ReorderAddressModal
      isOpen={isAddressOpen}
      onClose={() => setIsAddressOpen(!isAddressOpen)}
      animation='slideLeft'
      backdropColor='var(--modal-backdrop)'
    >
      <Text scale='body'>{t('order:reorderModal.setAddressMessage')}</Text>
      <ButtonsContainer container>
        <BillContainer item xs={6}>
          <Button
            block
            colorName='carbon'
            appearance='ghost'
            onClick={submitCurrentAddress}
          >
            {t('order:reorderModal.currentAddress')}
          </Button>
        </BillContainer>
        <FollowUpContainer item xs={6}>
          <Button block onClick={submitBasketAddress}>
            {t('order:reorderModal.basketAddress')}
          </Button>
        </FollowUpContainer>
      </ButtonsContainer>
    </ReorderAddressModal>
  )
}
export default ChooseAddressModal
