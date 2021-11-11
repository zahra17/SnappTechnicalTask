import React, {FC} from 'react'
import {Text} from '@sf/design-system'
import {Stock} from '@schema/product'
import {useTranslation} from 'react-i18next'

interface StockProps {
  max_show_stock_text: number
  min_show_stock_text: number
  stock: Stock
  count: number
  disableAdd?: boolean
}

const StockLimit: FC<StockProps> = ({
  stock,
  count,
  disableAdd,
  max_show_stock_text,
  min_show_stock_text,
}) => {
  const {t} = useTranslation()

  const hasStockLimit =
    (stock ?? 0) < max_show_stock_text && (stock ?? 0) > min_show_stock_text

  if (stock === 0 && count > 0) {
    return (
      <Text
        as='span'
        margin='3px 0 0 26px'
        weight='normal'
        align='center'
        scale='caption'
        colorName='carbon'
        colorWeight='light'
      >
        {t('out-of-stock')}
      </Text>
    )
  }

  if (!disableAdd && hasStockLimit)
    return (
      <Text
        as='span'
        margin='3px 0 0 0'
        weight='normal'
        scale='caption'
        colorName='carbon'
        colorWeight='light'
      >
        {t('remaining-stock-number', {stock})}
      </Text>
    )
  else return null
}

export default StockLimit
