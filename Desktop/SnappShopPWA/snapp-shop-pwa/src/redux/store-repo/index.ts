import {Cookies} from '@root/types'
import getStore from '../store-factory'
import rootReducer from '../reducers'
import {StoreShape} from '../store-types'

export default class StoreRepo {
  private static store: ReturnType<typeof getStore>

  private static cookies?: Cookies

  private static initialState?: StoreShape

  public static initiate(initialState: StoreShape) {
    StoreRepo.initialState = initialState
    return StoreRepo.create(false)
  }

  public static get(forceCreate: boolean, cookies?: Cookies) {
    StoreRepo.cookies = cookies
    return StoreRepo.create(forceCreate)
  }

  private static create(force: boolean) {
    if (!force && !!StoreRepo.store) return StoreRepo.store
    if (force) StoreRepo.initialState = undefined
    const {initialState, cookies} = StoreRepo
    StoreRepo.store = getStore({rootReducer, initialState, cookies})
    return StoreRepo.store
  }
}
