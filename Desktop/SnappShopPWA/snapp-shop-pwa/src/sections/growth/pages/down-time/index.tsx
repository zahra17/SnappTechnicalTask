import React, {useEffect, useState, useRef} from 'react'
import Head from 'next/head'
import {useTranslation} from 'react-i18next'
import growthSideEffects from '~growth/helpers'
import styled from 'styled-components'
import {rem} from 'polished'
import {
  FlexBox,
  Text,
  Input,
  Button,
  CircleCloseIcon,
  ExclamationIcon,
  toEnglish,
} from '@sf/design-system'
import {cellNumberValidation} from '@utils'
import requests from '~growth/endpoints'
import {isAPIResponse} from '@api'

import {Img} from '@components/Img'
import {DownTimeLayout} from '~growth/layouts/DownTImeLayout'

const Page = styled(DownTimeLayout)`
  min-height: 100vh;
  padding: ${({theme}) => theme.spacing[5]} 0;
`

const MainContainer = styled(FlexBox).attrs({
  justify: 'flex-start',
  alignItems: 'center',
  direction: 'column',
})`
  width: ${rem(1170)};
  margin: 0 auto;
`

const TitleText = styled(Text).attrs({
  weight: 'bold',
})`
  margin-bottom: 8px;
`
const SubTitleText = styled(Text)`
  margin-bottom: 15px;
`
const ResultContainer = styled(Text)`
  margin-top: 5px;
  margin-bottom: 15px;
`

const FormContainer = styled(FlexBox).attrs({
  direction: 'column',
  justify: 'space-between',
})`
  width: 31%;
  text-align: justify;
`

const InputWrapper = styled(FlexBox).attrs({
  direction: 'column',
})`
  position: relative;

  svg {
    position: absolute;
    top: 0;
    bottom: 0;
    left: ${rem(16)};
    z-index: 1;
    margin: auto;
    cursor: pointer;
  }
`
const ErrorContainer = styled(FlexBox)`
  margin-top: 10px;

  svg {
    margin-left: 3px;
  }
`

const MessageResult = styled(Text)`
  height: 40px;
`

const ImagesContainer = styled(FlexBox).attrs({
  justify: 'center',
  alignItems: 'center',
})`
  margin-bottom: 25px;
`

const handleDownTime = () => {
  const {t} = useTranslation()
  const [mobile, setMobile] = useState('')
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState('')
  const downTimeInputRef = useRef<HTMLInputElement>(null)

  // mobile validation
  useEffect(() => {
    setHasError(!cellNumberValidation(toEnglish(mobile)))
  }, [mobile])

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await requests.sendPhoneNumber<{
        status: boolean
      }>({
        data: {phone: toEnglish(mobile)},
      })
      if (isAPIResponse(response)) {
        setIsLoading(false)
        const {status} = response.data
        if (status) {
          setResult(t('growth:downTime.submitSuccess'))
          setMobile('')
          if (downTimeInputRef.current !== null) {
            downTimeInputRef.current.value = ''
          }
        }
      }
    } catch (err) {
      setIsLoading(false)
      setResult(t('growth:downTime.duplicateNumber'))
    }
  }

  return (
    <>
      <Head>
        <title>{t('growth:downTime.pageTitle')}</title>
      </Head>
      <Page>
        <MainContainer>
          <ImagesContainer>
            <Img src={`/static/images/downtime.png`} />
          </ImagesContainer>
          <TitleText scale='default'>{t('growth:downTime.title')}</TitleText>
          <SubTitleText scale='body'>
            <span>{t('growth:downTime.subTitle')}</span>
          </SubTitleText>
          <FormContainer>
            <InputWrapper>
              {!!mobile.length && (
                <CircleCloseIcon
                  onClick={() => {
                    if (downTimeInputRef.current !== null) {
                      downTimeInputRef.current.value = ''
                    }
                    setResult('')
                    setMobile('')
                  }}
                  fill='var(--sf-inactive-dark)'
                />
              )}
              <Input
                value={mobile}
                type='tel'
                placeholder={t('growth:downTime.inputPlaceholder')}
                err={hasError}
                onChange={e => {
                  setMobile(e.target.value)
                  setResult('')
                }}
                ref={downTimeInputRef}
              />
            </InputWrapper>
            <MessageResult scale='caption'>
              {hasError && (
                <ErrorContainer>
                  <ExclamationIcon
                    width={16}
                    height={16}
                    fill='var(--sf-alert-main)'
                  />
                  <Text scale='caption' colorName='alert' colorWeight='main'>
                    {t('growth:downTime.wrongNumber')}
                  </Text>
                </ErrorContainer>
              )}
              <ResultContainer
                scale='caption'
                colorName='carbon'
                colorWeight='light'
                style={{
                  opacity: 0.8,
                }}
              >
                {result}
              </ResultContainer>
            </MessageResult>
            <Button
              size='large'
              type='submit'
              isLoading={isLoading}
              disabled={
                mobile.length != 11 || !cellNumberValidation(toEnglish(mobile))
              }
              onClick={handleSubmit}
            >
              {t('growth:downTime.buttonText')}
            </Button>
          </FormContainer>
        </MainContainer>
      </Page>
    </>
  )
}

handleDownTime.getInitialProps = async (ctx: any) => {
  growthSideEffects(ctx)
}

export default handleDownTime
