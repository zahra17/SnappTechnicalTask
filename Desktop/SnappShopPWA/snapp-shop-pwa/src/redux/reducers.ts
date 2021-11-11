import coreSlice from '@slices/core'
import basketsSlice from '@slices/baskets/local-basket'
import basketsAPISlice from '@slices/baskets/remote-basket'

// sections' global reducers
import locationSlice from '~growth/redux/location'
import servicesSlice from '~search/redux/services'
import pendingOrdersSlice from '~order/redux/pendingOrders'
import reordersSlice from '~order/redux/reorders'
import homeSlice from '~search/redux/home'
import vendorsList from '~search/redux/vendorsList'
import productsSlice from '~search/redux/products'
import searchSlice from '~search/redux/search'
import vendorSlice from '~menu/redux/vendor'
import zooketSlice from '~menu/redux/zooket'
// static reducers
const rootReducer = {
  [coreSlice.name]: coreSlice.reducer,
  [basketsSlice.name]: basketsSlice.reducer,
  [basketsAPISlice.name]: basketsAPISlice.reducer,
  [locationSlice.name]: locationSlice.reducer,
  [servicesSlice.name]: servicesSlice.reducer,
  [pendingOrdersSlice.name]: pendingOrdersSlice.reducer,
  [reordersSlice.name]: reordersSlice.reducer,
  [homeSlice.name]: homeSlice.reducer,
  [vendorsList.name]: vendorsList.reducer,
  [productsSlice.name]: productsSlice.reducer,
  [searchSlice.name]: searchSlice.reducer,
  [vendorSlice.name]: vendorSlice.reducer,
  [zooketSlice.name]: zooketSlice.reducer,
}

export default rootReducer
