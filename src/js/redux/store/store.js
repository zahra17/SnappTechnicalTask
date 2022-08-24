import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import reducer from '../reducers/reducer';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './saga';

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
    reducer,
    middleware:[...getDefaultMiddleware({thunk: false}), sagaMiddleware]
});

sagaMiddleware.run(rootSaga);