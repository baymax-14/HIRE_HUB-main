import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from './authSlice';
import jobslice from './jobslice';
import companySlice from './companyslice';
import applicationslice from './applicants';
import notificationSlice from './notificationSlice';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const appReducer = combineReducers({
  auth: authSlice,
  job: jobslice,
  company: companySlice,
  application: applicationslice,
  notification: notificationSlice,
});

const rootReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    storage.removeItem('persist:project1-root');
    state = undefined; 
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: 'project1-root',
  version: 2,
  storage,
  whitelist: ['auth'], // Only persist authentication state
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
});

const persistor = persistStore(store);

export  { store, persistor };
export default store
