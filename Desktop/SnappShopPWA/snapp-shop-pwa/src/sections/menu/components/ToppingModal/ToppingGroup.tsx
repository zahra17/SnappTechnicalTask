import React, {useContext, useState} from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {useTranslation} from 'react-i18next'
import {Text, Price, FlexBox, Checkbox} from '@sf/design-system'
import {ProductContext} from '@contexts/Product'
import {useToast} from '@contexts/Toast'

// Types
import {ProductTopping, SingleTopping} from '@schema/product'

type ToppingGroupProps = ProductTopping & {
  a?: string
}

const Layout = styled.section<{isActive: boolean}>`
  margin-bottom: 1rem;
  padding: 1.25rem 1rem 1.125rem 1.125rem;
  border: ${rem(1)} solid
    ${({theme, isActive}) =>
      !isActive ? theme.carbon.alphaMedium : theme.alert.main};
  border-radius: 4px;

  &:last-child {
    margin-bottom: 0;
  }
`
const TitleBar = styled.div`
  /* padding: 0.5rem 0; */
  margin-bottom: 0.5rem;

  p {
    padding-left: 0.5rem;
  }
`
const ToppingItem = styled.section`
  border-bottom: ${rem(1)} solid ${({theme}) => theme.carbon.alphaLight};

  label {
    width: 100%;
  }

  &:last-child {
    border-bottom: 0;
  }
`
const ToppingItemLabel = styled(FlexBox)`
  width: calc(100% - 1rem);
  height: 3rem;
  cursor: pointer;

  p {
    margin: 0;
  }
`

const ToppingGroup: React.FC<ToppingGroupProps> = ({
  id,
  title,
  maxCount,
  minCount,
  toppings,
  isActive,
}: ToppingGroupProps) => {
  const {activeToppings, setContextState} = useContext(ProductContext)
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const {showToast} = useToast()
  const {t} = useTranslation()
  // const isActive=activeElements==id

  function handleClick(topping: SingleTopping) {
    if (selectedItems.includes(topping.id)) {
      // remove
      if (minCount === 1) {
        return
      }
      setSelectedItems((oldItems: number[]) =>
        oldItems.filter(item => item !== topping.id)
      )
      setContextState!({
        activeToppings: activeToppings!.filter(
          activeTopping => activeTopping.id !== topping.id
        ),
      })
    } else {
      // add
      const newActiveToppings = [...activeToppings!]
      if (minCount === 1) {
        newActiveToppings?.filter(item => !selectedItems?.includes(item?.id))
        newActiveToppings?.push(topping)
        setSelectedItems([topping.id])
      } else {
        if (selectedItems.length >= maxCount) {
          showToast({
            status: 'alert',
            right: 80,
            message: t('menu:topping.max-count-error', {
              text: title,
              score: maxCount?.toString(),
            }),
          })
          return
        }
        newActiveToppings?.push(topping)
        setSelectedItems((oldItems: number[]) => [...oldItems, topping.id])
      }
      setContextState!({activeToppings: newActiveToppings})
    }
  }

  return (
    <Layout id={`toppings-group-${id}`} isActive={isActive}>
      <TitleBar>
        <Text
          scale='caption'
          weight='bold'
          colorName={!isActive ? 'carbon' : 'alert'}
          colorWeight='light'
        >
          {title}
        </Text>

        {!!minCount && (
          <Text
            scale='caption'
            weight='normal'
            colorName={!isActive ? 'carbon' : 'alert'}
            colorWeight='light'
          >
            {t('menu:topping.min-count-select', {
              text: minCount.toString(),
            })}
          </Text>
        )}

        {/* {maxCount && (
          <Text
            scale='caption'
            weight='normal'
            colorName='carbon'
            colorWeight='light'
          >
            {t('menu:topping.max-count-select', {
              text: maxCount.toString(),
            })}
          </Text>
        )} */}
      </TitleBar>

      {toppings.map((toppingItem: SingleTopping) => (
        <ToppingItem key={toppingItem.id}>
          <Checkbox
            checked={selectedItems.includes(toppingItem.id)}
            name='address'
            onChange={() => handleClick(toppingItem)}
            round={minCount == 1}
          >
            <ToppingItemLabel justify='space-between' alignItems='center'>
              <FlexBox direction='column'>
                <Text scale='body' weight='normal' margin='0 0 5px 0'>
                  {toppingItem.title}
                </Text>

                {toppingItem.description && (
                  <Text
                    scale='body'
                    as='span'
                    colorName='carbon'
                    colorWeight='light'
                  >
                    {toppingItem.description}
                  </Text>
                )}
              </FlexBox>
              <Price value={toppingItem.price} />
            </ToppingItemLabel>
          </Checkbox>
        </ToppingItem>
      ))}
    </Layout>
  )
}

export default ToppingGroup
