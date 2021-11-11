import React from 'react'
import styled from 'styled-components'
import {
  RemoveIcon,
  EditIcon,
  Text,
  Checkbox,
  FlexBox,
  // Dropdown
} from '@sf/design-system'
import {rem} from 'polished'

interface AddressItemProps {
  id: string
  title: string
  address: string
  isActive: boolean
  onClick: (id: string) => void
  remove: any
  edit: any
}

const StyledAddressItem = styled(FlexBox)`
  position: relative;
  box-sizing: border-box;
  width: 100%;

  margin-bottom: 1rem;
  padding: ${rem(10)} 1rem ${rem(10)} 0;
  border: 1px solid ${({theme}) => theme.carbon.alphaLight};
  border-radius: ${rem(6)};

  &:last-child {
    margin-bottom: 0;
  }

  label {
    flex: 1;
  }
`
const LocationText = styled(FlexBox)`
  width: calc(100% - 55px);
  padding-right: 10px;
  cursor: pointer;
`

const ActionGroup = styled(FlexBox)`
  min-width: 1rem;
`
const IconAction = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: unset;
  border: unset;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`

// const ActionButton = styled.button`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 2rem;
//   height: 2rem !important;
//   margin-left: 0.7rem;
//   background-color: unset;
//   border: unset;
//   cursor: pointer;

//   &:focus {
//     outline: none;
//   }
// `

// const options = [
//   {label: 'ویرایش', value: 'edit'},
//   {label: 'حذف', value: 'delete'},
// ]

const AddressItem: React.FC<AddressItemProps> = (props: AddressItemProps) => {
  const {id, title, address, isActive, onClick, remove, edit} = props

  // function handleOption(e: React.MouseEventHandler<HTMLButtonElement>, value: string, id: string) {
  //   console.log(value, id)
  // }

  return (
    <StyledAddressItem alignItems='center' justify='space-between'>
      <Checkbox
        checked={isActive}
        name='address'
        onChange={() => onClick(id)}
        round
      >
        <LocationText direction='column'>
          <Text scale='body' weight='bold' margin='0 0 5px 0'>
            {title}
          </Text>
          <div>
            <Text scale='body' as='span' colorName='carbon' colorWeight='light'>
              {address}
            </Text>
          </div>
        </LocationText>
      </Checkbox>

      <ActionGroup>
        <IconAction onClick={remove}>
          <RemoveIcon
            // fill='var(--sf-carbon-alphaMedium)'
            fill='var(--sf-alert-main)'
            width='20px'
            height='20px'
            style={{marginRight: '0.6rem'}}
          />
        </IconAction>
        <IconAction onClick={edit}>
          <EditIcon
            // fill='var(--sf-carbon-alphaMedium)'
            fill='var(--sf-accent2-main)'
            width='20px'
            height='20px'
            style={{marginRight: '0.6rem'}}
          />
        </IconAction>
      </ActionGroup>

      {/* <Dropdown options={options} isRtl={false} id={+id} onChange={handleOption}>
        <ActionButton>
          <EllipsisV
            fill='var(--sf-accent2-main)'
            style={{marginRight: '0.6rem', width: '12px'}}
            />
        </ActionButton>
      </Dropdown> */}
    </StyledAddressItem>
  )
}

export default React.memo(AddressItem)
