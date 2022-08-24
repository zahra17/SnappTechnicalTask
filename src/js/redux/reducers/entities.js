import { combineReducers } from '@reduxjs/toolkit';
import vendorListsReducer from './vendorlists';

export default combineReducers({
    vendorLists: vendorListsReducer.reducer,
}); 