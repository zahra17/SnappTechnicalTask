import React, {FC} from 'react'
import {Text, FlexBox, Button, Modal} from '@sf/design-system'
import styled from 'styled-components'
import {rem} from 'polished'

interface ConfirmationModalProps {
  title: string
  caption?: string
  mainButtonText: string
  secondaryButtonText: string
  isModalOpen: boolean
  setIsModalOpen: (isModalOpen: boolean) => void
  onSubmit: () => void
  onClose?: () => {}
}

const Confirmation = styled(FlexBox)`
  width: ${rem(480)};
`

const Title = styled(Text)`
  padding: ${({theme}) => theme.spacing[2]};
`

const Caption = styled(Text)`
  padding: ${({theme}) => theme.spacing[2]};
  white-space: break-spaces;
`

const ButtonsContainer = styled(FlexBox)`
  padding: ${({theme}) => theme.spacing[2]};

  > {
    button {
      width: ${rem(216)};
    }
  }
`

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  title,
  caption,
  mainButtonText,
  secondaryButtonText,
  isModalOpen,
  setIsModalOpen,
  onClose,
  onSubmit,
}) => {
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      animation={'slideDown'}
      backdropColor='var(--modal-backdrop)'
    >
      <Confirmation justify='space-around' direction='column'>
        <Title scale='large' weight='bold'>
          {title}
        </Title>
        {caption && <Caption scale='default'>{caption}</Caption>}
        <ButtonsContainer justify='space-around'>
          <Button
            onClick={onClose ? onClose : handleCloseModal}
            colorName='carbon'
            appearance='ghost'
            size='large'
          >
            {secondaryButtonText}
          </Button>
          <Button onClick={onSubmit} size='large'>
            {mainButtonText}
          </Button>
        </ButtonsContainer>
      </Confirmation>
    </Modal>
  )
}

export default ConfirmationModal
