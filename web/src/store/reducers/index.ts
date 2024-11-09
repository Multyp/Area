import { combineReducers } from 'redux';

import snackbarReducer from './snackbar';
import menuReducer from './menu';

const reducers = combineReducers({
  snackbar: snackbarReducer,
  menu: menuReducer,
});

export default reducers;
