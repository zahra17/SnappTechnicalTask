import styled from 'styled-components'
import {rem} from 'polished'
import React from 'react'
import Link from 'next/link'
import {Text, Price, Button, FlexBox} from '@sf/design-system'
import {Product} from '@schema/product'
import {Img} from '@components/Img'
import {RateCommentBadge} from '@components/RateCommentBadge'
import {useTranslation} from 'react-i18next'
import {VendorModel} from '@schema/vendor'

interface Props {
  product: Product
  isLoading: boolean
}

const Box = styled(FlexBox).attrs({as: 'section'})<Partial<Props>>`
  --img-size: ${rem(112)};
  box-sizing: border-box;
  height: 100%;
  padding: ${({theme}) => theme.spacing[2]};
  cursor: pointer;
  opacity: ${({isLoading}) => (isLoading ? `0.6` : 'initial')};
`
const Footer = styled(FlexBox).attrs({as: 'footer'})`
  margin-top: ${rem(28)};

  > *:first-child {
    width: calc(100% - var(--img-size));
  }
`
const Body = styled(FlexBox)`
  > *:first-child {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding-top: ${({theme}) => theme.spacing[2]};
    padding-left: ${({theme}) => theme.spacing[2]};

    > *:last-child {
      margin-top: ${({theme}) => theme.spacing[1]};
    }
  }
`
const ImgWrapper = styled.div`
  position: relative;
  flex-shrink: 0;

  img {
    width: var(--img-size);
    height: var(--img-size);
    border-radius: ${rem(8)};
  }
`
const Logo = styled(Img)`
  position: relative;
  width: ${rem(32)};
  height: ${rem(32)};
  border-radius: ${rem(4)};
`
const VendorInfo = styled(FlexBox)`
  width: calc(100% - ${rem(32)} - ${rem(8)});
  height: ${rem(40)};
  margin-right: ${rem(8)};
`

const HtmlLink = styled.a`
  text-decoration: none;
`

export const SearchProductCard: React.FC<Props> = ({
  product,
  isLoading,
  ...props
}) => {
  const {t} = useTranslation()
  return (
    <Link href={new VendorModel(product.vendor).getLink(product)} passHref>
      <HtmlLink title={product.title}>
        <Box
          direction='column'
          justify='space-between'
          isLoading={isLoading}
          {...props}
        >
          <Body>
            <div>
              <RateCommentBadge
                rating={product.rating * 5}
                commentsCount={product.comment_count}
              />
              <Text as='h2' scale='default'>
                {product.title}
              </Text>
            </div>
            <ImgWrapper>
              <Img
                src={product.images[0]?.main}
                alt={product.title}
                width='112'
                height='112'
              />
            </ImgWrapper>
          </Body>
          <Footer justify='space-between' alignItems='center'>
            <FlexBox alignItems='center'>
              <Logo src={product.vendor.featured} />
              <VendorInfo direction='column' justify='space-between'>
                <Text scale='caption' ellipsis>
                  {product.vendor.title}
                </Text>
                <Price
                  value={product.price - product.discount}
                  discount={product.discountRatio}
                />
              </VendorInfo>
            </FlexBox>
            <Button appearance='outline' float>
              {t('show')}
            </Button>
          </Footer>
        </Box>
      </HtmlLink>
    </Link>
  )
}
