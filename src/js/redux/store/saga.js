import {all, takeLatest, call} from 'redux-saga/effects';
import {store} from './store';
import {getVendorList} from '../../share/getVendorList';
import vendorListReducer from '../reducers/vendorlists';
/**
 * @param action
 * this method call for each request vendor list
 */
function* fetchVendorList(action) {
    
    //call get vendor List api
    const list = yield call( getVendorList,
        'https://snappfood.ir/mobile/v2/restaurant/vendors-list',
         action.payload.pageNumber);
         //list to store data
    yield store.dispatch(vendorListReducer.actions.vendorListsAdd({
             vendorList: list
            }));
    // disable loader
    yield store.dispatch(vendorListReducer.actions.loaderStatusEdit({
        isLoading: false
    }));
}
 
function* watchFetchVendorList() {
    
    yield takeLatest(vendorListReducer.actions.vendorListGet, fetchVendorList);
}

export default function* rootSaga() {
    yield all([
        watchFetchVendorList()
    ])
}