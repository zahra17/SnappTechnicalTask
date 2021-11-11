import React, {FC} from 'react'
import styled, {useTheme} from 'styled-components'
import {useTranslation} from 'react-i18next'
import {
  FlexBox,
  SnappShopIcon as TypeMarkIcon,
  Text,
  Spinner,
} from '@sf/design-system'

import {SpecialBankInfo} from '@schema/basket'
import {Portal} from '@components/Portal'
import {Img} from '@components/Img'

type Props = {
  loading?: boolean
  title?: string
  gateway?: SpecialBankInfo
}

const AbsoluteWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${Math.pow(10, 10)};
  max-height: 100vh;
  background-color: ${({theme}) => theme.surface.main};
`
const Header = styled(FlexBox)`
  padding: ${({theme}) => theme.spacing[3]} 0;
`
const Content = styled(FlexBox)`
  margin-top: 25%;
`
const Image = styled(Img)`
  width: 40px;
  height: 40px;
  margin-bottom: ${({theme}) => theme.spacing[5]};
`
const Title = styled(Text)`
  margin-bottom: ${({theme}) => theme.spacing[2]};
`
const Loading = styled(Text)`
  margin-bottom: ${({theme}) => theme.spacing[4]};
  color: ${({theme}) => theme.carbon.light};
`

export const SpecialTransactionLoading: FC<Props> = ({
  title,
  gateway,
  loading,
}) => {
  const {t} = useTranslation()
  const theme = useTheme()

  if (!loading) return null
  return (
    <Portal>
      <AbsoluteWrapper>
        <Header justify='center'>
          <TypeMarkIcon width='81' height='41' fill={theme.accent.main} />
        </Header>
        <Content direction='column' justify='center' alignItems='center'>
          <Image src={gateway?.info.activeLogo} />
          <Title as='span' scale='large'>
            {title}
          </Title>
          <Loading as='span' scale='body'>
            {t('order:checkout.processing')}
          </Loading>
          <Spinner />
        </Content>
      </AbsoluteWrapper>
    </Portal>
  )
}
