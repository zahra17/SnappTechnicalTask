import React, {FC, MouseEvent} from 'react'
import {FlexBox} from '@sf/design-system'
import styled from 'styled-components'
import {rem} from 'polished'

import {Stock} from '@schema/product'
import StockLimit from './StockLimit'
import Buttons from './Buttons'

const MAX_SHOW_STOCK_TEXT: number = 10
const MIN_SHOW_STOCK_TEXT: number = 0

interface AddRemoveProps {
  stock: Stock
  count: number
  round?: boolean
  showStockLimit?: boolean
  onClickAdd: (e: MouseEvent<HTMLButtonElement>) => void
  onClickRemove: () => void
  hovered?: boolean
  disableAdd?: boolean
  appearance?: string
  isPending?: boolean
}

const AddRemoveWrapper = styled(FlexBox)<{hasStock: boolean}>`
  margin-top: ${({hasStock}) => (hasStock ? rem(12) : 0)};
`

const AddRemove: FC<AddRemoveProps> = ({showStockLimit = true, ...props}) => {
  return (
    <AddRemoveWrapper
      direction='column'
      alignItems='center'
      hasStock={
        (props.stock ?? 0) < MAX_SHOW_STOCK_TEXT &&
        (props.stock ?? 0) > MIN_SHOW_STOCK_TEXT
      }
    >
      <Buttons {...props} />
      {showStockLimit && (
        <StockLimit
          max_show_stock_text={MAX_SHOW_STOCK_TEXT}
          min_show_stock_text={MIN_SHOW_STOCK_TEXT}
          {...props}
        />
      )}
    </AddRemoveWrapper>
  )
}

export default AddRemove
