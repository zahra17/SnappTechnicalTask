import React from "react";
import '../../../style/pages/vendorList.scss';
import { useEffect } from "react";
import {store} from "../../redux/store/store";
import vendorListReducer from '../../redux/reducers/vendorlists';
import VendorListItems from '../components/vendorListItems';
function VendorList() {
    useEffect(() => {
        // get vendor list
        store.dispatch(vendorListReducer.actions.vendorListGet({
            pageNumber: store.getState().entities.vendorLists.pageNumber
        }));
    }, []);
    const vendorList = store.getState().entities.vendorLists.vendorList;
    // on scroll handler
    const onScrollHandler = (e) => {
        const isLoading = store.getState().entities.vendorLists.isLoading;
        if(isLoading){
            return;
        }
        
        if(e.target.offsetHeight + e.target.scrollTop + 200 > e.target.scrollHeight){
            store.dispatch(vendorListReducer.actions.vendorListGet({
                pageNumber: store.getState().entities.vendorLists.pageNumber
            }))
            store.dispatch(vendorListReducer.actions.loaderStatusEdit({
                isLoading: true
            }));
        }
    };
   
    const isLoading = store.getState().entities.vendorLists.isLoading;
    
    return (
        <>
         <VendorListItems store={store} list={vendorList} onScroll={onScrollHandler} />
        </>
    );
}
export default VendorList;