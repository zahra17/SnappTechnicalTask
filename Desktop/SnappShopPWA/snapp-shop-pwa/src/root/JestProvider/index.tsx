import i18n from 'i18next'
import React, {FC} from 'react'
import {defaultTheme} from '@sf/design-system'
import {ThemeProvider} from 'styled-components'
import {I18nextProvider, initReactI18next} from 'react-i18next'

import StoreRepo from '@redux'
import Providers from '../Providers'

const store = StoreRepo.get(true)

jest.mock('next/router')

i18n.use(initReactI18next).init({resources: {en: {core: {}}}, lng: 'en'})

const JestProvider: FC = ({children}) => {
  return (
    <Providers redux={{initialState: store.getState()}}>
      <ThemeProvider theme={defaultTheme}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </ThemeProvider>
    </Providers>
  )
}

export default JestProvider
