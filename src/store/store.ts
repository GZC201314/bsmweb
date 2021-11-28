import {createStore, combineReducers, compose} from 'redux';
import reducer from '../reducer/menureducer';
import loginReducer from "../reducer/loginReducer";
import CommonReducer from "../redux/common/reducer";

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

/*在这边合并多个reduces*/
const allReducer = combineReducers({
    menuReducer: reducer,
    loginReducer: loginReducer,
    CommonReducer: CommonReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// @ts-ignore
export const store = createStore(allReducer,
    composeEnhancers());

export type RootState = ReturnType<typeof store.getState>

