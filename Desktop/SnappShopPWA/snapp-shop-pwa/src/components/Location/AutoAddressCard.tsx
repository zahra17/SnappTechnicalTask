import React from 'react'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'

import {Button, Text, ChevronDownIcon, ExclamationIcon} from '@sf/design-system'

interface AutoAddressCardProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Layout = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 20px;
`

const AutoAddressCard: React.FC<AutoAddressCardProps> = ({
  onClick,
}: AutoAddressCardProps) => {
  const {t} = useTranslation()
  return (
    <Layout colorName='accent' appearance='ghost' onClick={onClick}>
      <ExclamationIcon
        fill='var(--sf-alert-main)'
        style={{margin: '0 0.4rem 0 0.6rem', width: '20px'}}
      />
      <Text scale='body' colorName='alert' colorWeight='main' ellipsis>
        {t('core:location.selectYourAddress')}
      </Text>
      <ChevronDownIcon
        fill='var(--sf-alert-main)'
        style={{margin: '0.1rem 0.6rem 0 0.4rem', width: '12px'}}
      />
    </Layout>
  )
}

export default React.memo(AutoAddressCard)
