import React from 'react'
import {FlexBox, Text} from '@sf/design-system'
import {useTranslation} from 'react-i18next'

interface NoResultProps {
  message?: string
  searchMessage?: string
  children?: React.ReactNode
}

const NoResult: React.FC<NoResultProps> = ({message, children}) => {
  const {t} = useTranslation()
  const finalMessage = message || t('no-result')
  return (
    <FlexBox
      justify='center'
      alignItems='center'
      direction='column'
      style={{margin: 0, height: '50vh'}}
    >
      {children}
      <Text
        margin='1rem 0'
        scale='body'
        colorName='inactive'
        colorWeight='dark'
      >
        {finalMessage}
      </Text>
    </FlexBox>
  )
}

export default React.memo(NoResult)
