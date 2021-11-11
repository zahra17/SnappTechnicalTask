import React from 'react'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'
import {PlusIcon, Button} from '@sf/design-system'
import AddressItem from './AddressItem'
import {Address} from '@schema/address'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'

interface AddressListProps {
  data: Array<Address>
  activeAddress?: Address | null
  changeStep: (step: string) => void
  setActiveAddress: (id: string | number) => void
  goToEdit: (id: string) => void
  goToRemove: (id: string) => void
  isCheckout: boolean
}

const Layout = styled.div`
  padding: 0 1rem 1rem;

  &:first-child {
    padding-top: 1rem;
  }

  button {
    justify-content: flex-start;
    height: 3.5rem;
  }
`
const WrapperItems = styled.section`
  max-height: 60vh;
  margin-bottom: 1rem;
  overflow: auto;
`

const AddressList: React.FC<AddressListProps> = ({
  data,
  changeStep,
  activeAddress,
  setActiveAddress,
  goToEdit,
  goToRemove,
  isCheckout,
}: AddressListProps) => {
  const {t} = useTranslation()
  const rudderStack = useRudderStack()
  function handleClickNewAddress(): void {
    changeStep('newAddress')
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: isCheckout
        ? 'Checkout logged-in Address create new address'
        : 'Home logged-in Address create new address',
      payload: {},
    })
  }

  function handleClickItem(id: number | string) {
    if (id !== activeAddress?.id) {
      setActiveAddress(id)
      rudderStack.eventTrigger({
        type: eventTypes.track,
        eventName: 'Home logged-in Address Select new select',
        payload: {
          address_id: Number(id),
        },
      })
    }
  }
  const addressRemoveHandler = (id: number | string) => {
    goToRemove(String(id))
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Home logged-in Address Select delete',
      payload: {
        address_id: Number(id),
      },
    })
  }
  const addressEditHandler = (id: number | string) => {
    goToEdit(String(id))
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Home logged-in Address Select edit',
      payload: {
        address_id: Number(id),
      },
    })
  }
  return (
    <Layout>
      <WrapperItems>
        {data?.map(item => (
          <AddressItem
            key={item.id}
            id={String(item.id)}
            title={item.label}
            address={item.address}
            isActive={String(item.id) === String(activeAddress?.id)}
            onClick={() => {
              handleClickItem(item.id)
            }}
            edit={() => addressEditHandler(item.id)}
            remove={() => addressRemoveHandler(item.id)}
          />
        ))}
      </WrapperItems>
      <Button
        appearance='naked'
        colorName='accent2'
        block
        onClick={handleClickNewAddress}
      >
        <PlusIcon style={{marginLeft: '1rem'}} />
        {t('core:location.footer.createNewAddress')}
      </Button>
    </Layout>
  )
}

export default AddressList
