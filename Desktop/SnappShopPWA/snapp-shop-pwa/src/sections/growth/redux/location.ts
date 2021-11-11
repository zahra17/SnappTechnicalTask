import {createSlice, PayloadAction, createSelector} from '@reduxjs/toolkit'

import {StoreShape} from '@redux'
import {Address, City} from '@schema/address'
import {Location, Modes, LatLong} from '@schema/location'
import {CookyLocation} from '@schema/location'
import {updateUserAddressesAction} from '@slices/baskets/remote-basket'
import {logout} from '@slices/core'

export interface LocationState extends Location {
  newAddress: unknown
  cities: City[]
  localAddresses?: unknown
  newLocalAddress?: unknown
  modal: boolean
  mode: Modes
  error: string | null
  isLoading: boolean
  userAddresses: Address[]
}

const initialState: LocationState = {
  newAddress: null,
  cities: [],
  modal: false,
  mode: Modes.Auto,
  activeAddress: '',
  activeLocation: {
    lat: -1,
    long: -1,
  } as LatLong,
  areaAddress: '',
  error: null,
  isLoading: false,
  userAddresses: [],
}

type ShowModalAction = PayloadAction<boolean>
type SetActiveAction = PayloadAction<Address['id']>
type SetModeAction = PayloadAction<Modes>

export type LocationActions = ShowModalAction | SetActiveAction | SetModeAction

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    showModal: (state, {payload}: PayloadAction<boolean>) => {
      state.modal = payload
    },
    setActive: (state, {payload}: PayloadAction<CookyLocation>) => {
      if (payload.id) {
        state.activeAddress = payload.id
        state.mode = Modes.Address
      }
      if (payload.id) state.activeAddress = payload.id
      if (payload.mode) state.mode = payload.mode
      if (payload.address) state.areaAddress = payload.address
      state.activeLocation = {
        lat: Number(payload.latitude),
        long: Number(payload.longitude),
      }
    },
    setMode: (state, {payload}: PayloadAction<Modes>) => {
      state.mode = payload
    },
  },
  extraReducers: builder => {
    builder.addCase(updateUserAddressesAction, (state, {payload: address}) => {
      if (address) {
        const {id, latitude, longitude} = address
        state.activeAddress = id
        state.activeLocation = {lat: +latitude, long: +longitude}
      }
    })
    builder.addCase(logout.fulfilled, state => {
      state.newAddress = null
      ;(state.cities = []),
        (state.modal = false),
        (state.mode = Modes.Auto),
        (state.activeAddress = ''),
        (state.activeLocation = {
          lat: -1,
          long: -1,
        }),
        (state.areaAddress = ''),
        (state.error = null),
        (state.isLoading = false)
    })
  },
})

export default locationSlice

// Selectors
export const selectSlice = (state: StoreShape) => state[locationSlice.name]
// export const selectLocation = createSelector(selectSlice, slice => slice)
export const selectIsModalOpen = createSelector(
  selectSlice,
  slice => slice.modal
)
export const selectActiveAddressId = createSelector(
  selectSlice,
  slice => slice.activeAddress
)

export const selectLocation = (state: StoreShape) => {
  const limit = Number(state.core.appData?.locationPrecision) || 3
  // state.location.activeLocation.lat = Number(state.location.activeLocation.lat).toFixed(limit)
  // state.location.activeLocation.long = Number(state.location.activeLocation.long).toFixed(limit)
  return {
    ...state.location,
    activeLocation: {
      lat: Number(state.location.activeLocation.lat).toFixed(limit),
      long: Number(state.location.activeLocation.long).toFixed(limit),
    },
  }
}

export const selectActiveAddress = (state: StoreShape) => {
  const activeId = state.location.activeAddress
  const addresses = state.core?.user?.addresses
  return addresses?.find(address => String(address.id) === String(activeId))
}

// actions
export const {setMode, setActive, showModal} = locationSlice.actions
