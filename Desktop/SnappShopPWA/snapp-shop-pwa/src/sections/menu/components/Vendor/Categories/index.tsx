import React, {useState, useRef, useEffect} from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {useTranslation} from 'react-i18next'
import {MainGiftIcon, Text, FlexBox, Badge} from '@sf/design-system'
import {MenuCategory} from '@schema/product'
import {useWindowScroll} from '@hooks/useWindowScroll'
import {COUPON_CATEGORY_ID} from '~menu/constants'
import {useSelector} from 'react-redux'
import {selectCouponsList} from '~menu/redux/vendor'

interface Props {
  categories: MenuCategory[]
}

interface CategoryItemProps {
  active?: boolean
  isCoupon?: boolean
}

const CategoryItem = styled(Text).attrs(() => ({scale: ''}))<CategoryItemProps>`
  margin-top: ${({isCoupon}) => (isCoupon ? rem(8) : '')};
  padding: ${rem(2)} ${rem(12)};
  color: ${({theme, active}) =>
    active ? theme.carbon.main : theme.carbon.light};
  font-size: ${rem(14)};
  border-left: ${({theme, active}) =>
    active ? `${rem(2)} solid ${theme.carbon.main}` : ''};
  cursor: pointer;
`

const CouponItem = styled(FlexBox)`
  position: relative;

  svg {
    margin-left: ${rem(8)};
  }
`

const BadgeWrapper = styled(Badge)`
  position: absolute;
  top: ${rem(-8)};
  left: ${rem(68)};
`

export const Categories: React.FC<Props> = ({categories}) => {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>()
  const isStill = useRef(true)
  const {t} = useTranslation()
  const couponsList = useSelector(selectCouponsList)
  const getActiveSectionFromPoint = () => {
    const elem = document.elementFromPoint(window.innerWidth / 2, 250)
    const section = elem?.closest('[data-categoryid]') as HTMLElement
    if (
      section &&
      activeCategory?.categoryId === Number(section.dataset.categoryid)
    ) {
      isStill.current = true
    }
    return categories.find(
      c => Number(section?.dataset?.categoryid) === c.categoryId
    )
  }
  useEffect(() => {
    setActiveCategory(getActiveSectionFromPoint() || categories[0])
  }, [categories])

  // Set active based on scroll position
  useWindowScroll({
    callback: () => {
      const active = getActiveSectionFromPoint()
      if (active && isStill.current) {
        setActiveCategory(active)
      }
    },
    wait: 10,
    deps: [categories, activeCategory],
  })

  return (
    <>
      {categories.map(cat => (
        <CategoryItem
          key={cat.categoryId}
          onClick={() => {
            isStill.current = false
            setActiveCategory(cat)
            const section = document.querySelector(
              `[data-categoryid="${cat.categoryId}"]`
            ) as HTMLElement
            if (section) {
              section.scrollIntoView({
                behavior: 'smooth',
              })
            }
          }}
          active={cat.categoryId === activeCategory?.categoryId}
          weight={
            cat.categoryId === activeCategory?.categoryId ? 'bold' : 'normal'
          }
          isCoupon={cat.categoryId === COUPON_CATEGORY_ID}
        >
          {cat.categoryId === COUPON_CATEGORY_ID ? (
            <CouponItem as='span' alignItems='center'>
              {t('menu:coupon')}
              <MainGiftIcon
                fill='var(--sf-carbon-main)'
                width='20'
                height='20'
              />
              {Boolean(couponsList.count) && (
                <BadgeWrapper width={18} height={16}>
                  <Text
                    scale='body'
                    colorName='surface'
                    colorWeight='light'
                    as='span'
                  >
                    {couponsList.count}
                  </Text>
                </BadgeWrapper>
              )}
            </CouponItem>
          ) : (
            cat.category
          )}
        </CategoryItem>
      ))}
    </>
  )
}
