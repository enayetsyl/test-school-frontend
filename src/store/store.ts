// src/store/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import auth from "./auth.slice";
import ui from "./ui.slice";
import { baseApi } from "@/services/baseApi";
import { persistConfig } from "./presistConfig";

const rootReducer = combineReducers({
  auth,
  ui,
  [baseApi.reducerPath]: baseApi.reducer,
});
const persisted = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persisted,
  middleware: (gDM) =>
    gDM({ serializableCheck: false }).concat(baseApi.middleware),
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
