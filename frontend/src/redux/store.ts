"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/user.slice";
import postReducer from "./post/editPost.slice";
// import storage from "redux-persist/lib/storage";
import storage from "./storage";
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
  key: "root",
  storage,
};
const rootReducer = combineReducers({
  user: persistReducer(persistConfig, userReducer),
  post: postReducer,
  //post: postReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

store.subscribe(() => {
  console.log("Updated Redux State:", store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
