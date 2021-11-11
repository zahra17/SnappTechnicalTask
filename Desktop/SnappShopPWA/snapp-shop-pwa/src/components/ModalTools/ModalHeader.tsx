import React from 'react'
import styled from 'styled-components'
import {CloseIcon, Text, FlexBox} from '@sf/design-system'

interface ModalHeaderProps {
  title?: string | null
  onClose: any
}

const StyledModalHeader = styled(FlexBox)`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 56px;
  padding-left: 56px;
`
const ActionButton = styled.button`
  width: 56px;
  height: 56px;
  background-color: unset;
  border: unset;
  outline: none;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`

const ModalHeader: React.FC<ModalHeaderProps> = ({onClose, title = ''}) => {
  return (
    <StyledModalHeader alignItems='center' justify='space-between'>
      <ActionButton onClick={onClose}>
        <CloseIcon />
      </ActionButton>
      <Text scale='body' weight='bold'>
        {title}
      </Text>
      <div></div>
    </StyledModalHeader>
  )
}

export default React.memo(ModalHeader)
