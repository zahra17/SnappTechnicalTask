import React, {useState} from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {
  FlexBox,
  Text,
  PinIcon,
  Button,
  SearchIcon,
  Input,
  toEnglish,
} from '@sf/design-system'
import requests from '~search/endpoints'
import {useTranslation} from 'react-i18next'
import {cellNumberValidation} from '@utils'

const InputWrapper = styled(FlexBox)`
  box-sizing: border-box;
  width: 30vw;
  min-width: ${rem(300)};
  max-width: 50%;
  height: ${rem(48)};
  margin-top: ${rem(6)};
  overflow: hidden;
  background-color: ${({theme}) => theme.surface.light};
  border: ${rem(1)} solid ${({theme}) => theme.carbon.alphaMedium};
  border-radius: ${rem(6)};
  box-shadow: ${({theme}) => theme.shadows.medium};

  /* Input */
  > :first-child {
    flex-grow: 1;
    border: unset;
  }
  /* Button */
  > :last-child {
    margin-left: ${({theme}) => theme.spacing[1]};
  }
  /* Message Text */
  + * {
    margin-top: ${({theme}) => theme.spacing[1]};
  }
`
enum SubmitStatus {
  INVALID = 'invalid',
  FAILED = 'failed',
  SUCCESS = 'success',
}
export const DownloadInput: React.FC = props => {
  const {t} = useTranslation()
  const [status, setStatus] = useState<SubmitStatus>()

  return (
    <div>
      <Text scale='caption' weight='bold' colorWeight='light'>
        {t(`search:home.get-download-link`)}
      </Text>
      <InputWrapper
        as='form'
        alignItems='center'
        justify='space-between'
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()

          const formData = new FormData(e.currentTarget)
          const cellphone = toEnglish(String(formData.get('cellphone')))
          formData.set('cellphone', cellphone)

          if (cellNumberValidation(cellphone) && cellphone.length === 11) {
            setStatus(undefined)
            requests
              .sendLinkSms({data: formData, transformRequest: data => data})
              .then(() => {
                setStatus(SubmitStatus.SUCCESS)
              })
              .catch(() => {
                setStatus(SubmitStatus.FAILED)
              })
          } else {
            setStatus(SubmitStatus.INVALID)
          }
        }}
        {...props}
      >
        <Input placeholder='*********۰۹' name='cellphone' type='tel' />
        <Button size='body' type='submit'>
          دریافت لینک
        </Button>
      </InputWrapper>
      {Boolean(status) && (
        <Text
          colorName={status === SubmitStatus.SUCCESS ? 'accent2' : 'alert'}
          scale='body'
        >
          {t(`search:home.sms-${status}`)}
        </Text>
      )}
    </div>
  )
}
