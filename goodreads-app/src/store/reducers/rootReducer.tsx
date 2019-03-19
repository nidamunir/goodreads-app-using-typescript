import bookReducer from './bookReducer';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    book: bookReducer
});

export default rootReducer;