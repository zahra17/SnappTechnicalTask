import React, {useEffect} from 'react'
import styled from 'styled-components'
import {SimplePageComponent} from '@root/types'
import Head from 'next/head'
import growthSideEffects from '~growth/helpers'
import {useTranslation} from 'react-i18next'
import {rem} from 'polished'
import {FlexBox, Text} from '@sf/design-system'
import {useBodyColor} from '@hooks/useBodyColor'
import {Header} from '@root/Layout/Header'
import {Footer} from '@root/Layout/Footer'
import {useRouter} from 'next/router'

const Page = styled(FlexBox).attrs({
  direction: 'column',
  justify: 'center',
  alignItems: 'center',
})`
  max-width: 100vw;
`

const HeaderContainer = styled.div`
  width: 100vw;

  @media screen and (max-width: 1080px) {
    display: none;
  }
`

const MainContainer = styled(FlexBox).attrs({
  direction: 'column',
  alignItems: 'center',
})`
  max-width: ${rem(1080)};
  margin-top: ${rem(20)};
  padding: 0 ${rem(40)} ${rem(68)};

  @media screen and (max-width: 1080px) {
    margin-top: ${rem(25)};
  }
`

const Title = styled(Text)`
  margin-bottom: ${rem(30)};
  line-height: ${rem(35)};
  text-align: center;

  @media screen and (max-width: 1080px) {
    margin-bottom: 0;
  }
`

const QuestionCategoryContainer = styled(FlexBox).attrs({
  direction: 'column',
})`
  margin-top: ${rem(35)};
`

const CategoryTitle = styled(Text)`
  margin: 0 0 ${rem(20)};
`

const QuestionText = styled(Text)`
  display: block;
  margin-bottom: ${rem(10)};
  padding-top: ${rem(10)};
`

const AnswerText = styled(Text)``

const QuestionDivider = styled.div`
  margin: ${rem(30)} 0 ${rem(20)};
  border: 0;
  border-top: ${rem(1)} solid ${({theme}) => theme.inactive.light};
`

const FooterContainer = styled(HeaderContainer)``

const Faq: SimplePageComponent = () => {
  const {t} = useTranslation()
  const {query} = useRouter()
  useBodyColor('dark')

  return (
    <>
      <Head>
        <title>{t('growth:faq.pageTitle')}</title>
      </Head>
      <Page>
        {!query.app && (
          <HeaderContainer>
            <Header />
          </HeaderContainer>
        )}
        <MainContainer>
          <Title scale='xlarge' weight='bold'>
            {t('growth:faq.faqTitle')}
          </Title>
          {(t('growth:faq.categories', {returnObjects: true}) as []).map(
            (
              category: {
                title: string
                questionsAndAnswers: {question: string; answer: string}[]
              },
              categoryIndex: number
            ) => {
              const {title, questionsAndAnswers} = category
              return (
                <QuestionCategoryContainer key={categoryIndex}>
                  <CategoryTitle
                    colorName='accent'
                    colorWeight='dark'
                    weight='bold'
                    scale='large'
                  >
                    {title}
                  </CategoryTitle>
                  {questionsAndAnswers.map((question, questionIndex) => (
                    <div key={questionIndex}>
                      <QuestionText scale='body' weight='bold'>
                        {question.question}
                      </QuestionText>
                      <AnswerText
                        align='justify'
                        colorName='carbon'
                        colorWeight='main'
                        scale='caption'
                        lh='default'
                      >
                        {question.answer}
                      </AnswerText>
                      <QuestionDivider />
                    </div>
                  ))}
                </QuestionCategoryContainer>
              )
            }
          )}
        </MainContainer>
        {!query.app && (
          <FooterContainer>
            <Footer />
          </FooterContainer>
        )}
      </Page>
    </>
  )
}

Faq.getInitialProps = async ctx => {
  growthSideEffects(ctx)
}

export default Faq
