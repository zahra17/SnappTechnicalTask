import {useDispatch} from 'react-redux'
import getStore from './store-factory'

export type {StoreShape, AppThunk} from './store-types'

export * from './store-types'

export {default} from './store-repo'

export type AppStore = ReturnType<typeof getStore>
export type AppDispatch = AppStore['dispatch']

export const useAppDispatch = () => useDispatch<AppDispatch>()
