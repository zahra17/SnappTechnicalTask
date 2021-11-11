import React, {FC, MouseEvent} from 'react'
import {rem} from 'polished'
import {
  Text,
  FlexBox,
  Button,
  PlusIcon,
  RemoveIcon,
  MinusIcon,
  Spinner,
} from '@sf/design-system'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'

interface ButtonsProps {
  count: number
  round?: boolean
  onClickAdd: (e: MouseEvent<HTMLButtonElement>) => void
  onClickRemove: () => void
  hovered?: boolean
  disableAdd?: boolean
  appearance?: string
  isPending?: boolean
}

const Counter = styled(FlexBox)`
  min-height: ${({theme}) => theme.spacing[5]};

  > {
    &:nth-child(2) {
      width: ${({theme}) => theme.spacing[6]};
      text-align: center;
    }

    Button {
      min-width: ${({theme}) => theme.spacing[4]};
    }
  }
`

const StockButton = styled(Button)`
  &:disabled svg {
    fill: var(--sf-inactive-dark);
  }
`

const AddButton = styled(Button)`
  height: ${rem(37)};
  font-weight: ${({theme}) => theme.weight.normal};
  font-size: ${rem(14)};
  line-height: ${rem(20)};
`

const Buttons: FC<ButtonsProps> = ({
  count,
  round,
  onClickAdd,
  onClickRemove,
  hovered,
  disableAdd,
  appearance,
  isPending = false,
}) => {
  const {t} = useTranslation()

  if (count > 0)
    return (
      <Counter alignItems='center' justify='center'>
        <Button
          float={count !== 1}
          type='button'
          round={round}
          size='body'
          appearance={count === 1 ? 'naked' : 'outline'}
          colorName={count === 1 ? 'carbon' : 'accent'}
          onClick={onClickRemove}
        >
          {count === 1 ? (
            <RemoveIcon role='button' />
          ) : (
            <MinusIcon fill='var(--sf-accent-main)' width={10} height={10} />
          )}
        </Button>
        <Text scale='body' weight='bold' as='span'>
          {count}
        </Text>
        <StockButton
          float
          type='button'
          round={round}
          disabled={disableAdd}
          size='body'
          appearance={hovered ? 'solid' : 'outline'}
          onClick={onClickAdd}
        >
          <PlusIcon
            fill={hovered ? 'var(--sf-surface-light)' : 'var(--sf-accent-main)'}
            width={10}
            height={10}
          />
        </StockButton>
      </Counter>
    )

  return (
    <AddButton
      float
      appearance={
        appearance
          ? (appearance as 'solid' | 'outline')
          : hovered
          ? 'solid'
          : 'outline'
      }
      onClick={onClickAdd}
      disabled={disableAdd}
    >
      {isPending ? <Spinner colorName='surface' size='10px' /> : t('add')}
    </AddButton>
  )
}

export default Buttons
