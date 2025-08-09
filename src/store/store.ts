// src/store/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  type PersistConfig,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import auth from "./auth.slice";
import ui from "./ui.slice";
import { baseApi } from "@/services/baseApi";

// 1) Build root reducer
const rootReducer = combineReducers({
  auth,
  ui,
  [baseApi.reducerPath]: baseApi.reducer,
});

// 2) Derive the exact state type from rootReducer (this is the missing type)
type RootReducerState = ReturnType<typeof rootReducer>;

// 3) Strongly-typed persist config (persist only feature slices)
const persistConfig: PersistConfig<RootReducerState> = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth", "ui"] as Array<Extract<keyof RootReducerState, string>>,
};

// 4) Wrap reducer with persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 5) Store + middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

// App-level types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
