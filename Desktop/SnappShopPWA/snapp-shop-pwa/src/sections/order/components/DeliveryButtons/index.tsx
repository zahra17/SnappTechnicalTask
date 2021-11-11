import React, {useState, FC} from 'react'
import styled from 'styled-components'
import {Button, Text, FlexBox} from '@sf/design-system'
import {ButtonType} from '~order/types'
import requests from '~order/endpoints'
import {isAPIResponse} from '@api'
import {useTranslation} from 'react-i18next'
import ConfirmationModal from '@components/ConfirmationModal'

interface DeliveryButtonProps {
  buttons: {message: string; buttons: ButtonType[]}
  orderCode: string
  fetchOrder: Function
}

const Container = styled(FlexBox)`
  padding: ${({theme}) => theme.spacing[1]} ${({theme}) => theme.spacing[2]};
`
const ButtonsContainer = styled(FlexBox)`
  margin-top: ${({theme}) => theme.spacing[2]};

  > {
    &:last-child {
      flex: 3;
      margin-right: ${({theme}) => theme.spacing[2]};
    }
  }
`

const DeliveryButton: FC<DeliveryButtonProps> = ({
  buttons,
  orderCode,
  fetchOrder,
}) => {
  const {t} = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  async function setDeliverance() {
    setIsLoading(true)
    try {
      const response = await requests.setDeliverance<{
        data: unknown
      }>({
        data: {orderCode},
      })
      if (isAPIResponse(response)) {
        setIsLoading(false)
        fetchOrder()
        return
      }
      throw {message: 'err'}
    } catch (err) {
      setIsLoading(false)
      console.log('err in catch (setDeliverance)', err)
    }
  }

  async function setOrderDelay() {
    setIsLoading(true)
    try {
      const response = await requests.setOrderDelay<{
        data: unknown
      }>({
        data: {orderCode},
      })
      if (isAPIResponse(response)) {
        setIsLoading(false)
        fetchOrder()
        return
      }
      throw {message: 'err'}
    } catch (err) {
      setIsLoading(false)
      console.log('err in catch (setOrderDelay)', err)
    }
  }
  const button_names = t('order:followOrder.button_names').split('&')
  return (
    <>
      <Container direction='column'>
        <Text scale='large' weight='bold'>
          {buttons.message}
        </Text>
        <ButtonsContainer>
          {buttons.buttons
            .sort((a, b) => (a.title > b.title ? -1 : 1))
            .map(button => (
              <Button
                key={button.title}
                appearance={
                  button.title === t('order:followOrder.yes')
                    ? 'solid'
                    : 'outline'
                }
                colorName={
                  button.title === t('order:followOrder.yes')
                    ? 'accent2'
                    : 'alert'
                }
                onClick={
                  button.title === t('order:followOrder.yes')
                    ? setDeliverance
                    : () => setIsModalOpen(true)
                }
                isLoading={isLoading}
              >
                {button.title === t('order:followOrder.yes')
                  ? button_names[0]
                  : button_names[1]}
              </Button>
            ))}
        </ButtonsContainer>
      </Container>
      <ConfirmationModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title={t('order:followOrder.delayConfirmationTitle')}
        caption={t('order:followOrder.delayConfirmationCaption')}
        mainButtonText={t('order:followOrder.delay')}
        secondaryButtonText={t('order:followOrder.cancel')}
        onSubmit={setOrderDelay}
      />
    </>
  )
}

export default DeliveryButton
