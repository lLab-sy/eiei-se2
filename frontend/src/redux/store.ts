'use client'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/user.slice';
import postReducer from "./post/post.slice";
// import storage from "redux-persist/lib/storage";
import storage from './storage';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from "redux-persist";

  const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'],
};

const rootReducer = combineReducers({
    user: userReducer,
    post: postReducer,
})
const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],            }
    })
    
    
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
export const persistor = persistStore(store)