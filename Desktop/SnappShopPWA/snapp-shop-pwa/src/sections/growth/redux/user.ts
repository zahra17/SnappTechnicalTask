import {createSlice, EntityState} from '@reduxjs/toolkit'

import {User} from '@schema/user'

import {MenuCategory} from '@schema/product'

export type UserState = EntityState<MenuCategory> & {
  user: User | null
}

const userSlice = createSlice({
  name: 'growth/user',
  initialState: null,
  reducers: {},
})

export default userSlice
