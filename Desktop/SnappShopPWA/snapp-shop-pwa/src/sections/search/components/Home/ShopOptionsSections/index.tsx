import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {bks, FlexBox} from '@sf/design-system'
import {ShopOptions} from '~search/components/ShopOption'
import {SHOP_SERVICE_OPTIONS} from '~search/types'

interface Props {
  services: {
    data: SHOP_SERVICE_OPTIONS[]
  }
}

const Options = styled(FlexBox)``

export const ShopOptionsSection: React.FC<Props> = ({services}) => {
  return (
    <Options direction='row' justify='space-between'>
      {services?.data?.map(item => (
        <ShopOptions
          title={item.title}
          key={item.title}
          description={item.description}
          Icon={item.Icon}
        />
      ))}
    </Options>
  )
}
