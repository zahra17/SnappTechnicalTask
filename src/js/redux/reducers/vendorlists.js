import {createSlice} from '@reduxjs/toolkit';

const vendorListsReducer = createSlice({
    name: 'lists',
    initialState: {
        vendorList: [],
        pageNumber: 0,
        isLoading: false
    },
    reducers: {
        vendorListsAdd: (lists, action) => {
            const vendorList = Array.prototype
                .filter.call(action.payload.vendorList, (item) => item.type === "VENDOR");
            vendorList.forEach((item, index) => {
                lists.vendorList.push(item);
            })
            lists.pageNumber++;
            return lists;
        },
        vendorListGet: (lists, action)=> {
            lists.pageNumber = action.payload.pageNumber;
            return lists;
        },
        loaderStatusEdit: (lists, action) => {
            lists.isLoading = action.payload.isLoading;
        },


    }
});

export default vendorListsReducer;