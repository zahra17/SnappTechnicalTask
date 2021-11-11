import React from 'react'
import styled from 'styled-components'

import {rem} from 'polished'
import {useTranslation} from 'react-i18next'

import {Modal, FlexBox, Button, Text} from '@sf/design-system'

interface Props {
  vendorMessageIsOpen: boolean
  vendorMessage?: string
  handleClose: () => void
}

const Container = styled(FlexBox)`
  width: ${rem(480)};
  padding: ${rem(16)};
`

const BodyOfMessage = styled(Text)`
  padding-bottom: ${rem(24)};
`

export const VendorMessageModal: React.FC<Props> = ({
  vendorMessageIsOpen,
  vendorMessage = '',
  handleClose = () => {},
}) => {
  const {t} = useTranslation()
  return (
    <Modal isOpen={vendorMessageIsOpen} onClose={handleClose}>
      <Container direction='column'>
        <BodyOfMessage
          scale='large'
          colorName='carbon'
          dangerouslySetInnerHTML={{
            __html: vendorMessage,
          }}
        ></BodyOfMessage>
        <Button
          round={false}
          size='body'
          appearance={'outline'}
          colorName={'carbon'}
          onClick={() => handleClose()}
        >
          {t('order:followOrder.got_it')}
        </Button>
      </Container>
    </Modal>
  )
}
