// src/store/persistConfig.ts
import storage from "redux-persist/lib/storage";
import type { PersistConfig } from "redux-persist";

export function makePersistConfig<S>(): PersistConfig<S> {
  return {
    key: "root",
    version: 1,
    storage,
    whitelist: [] as Array<Extract<keyof S, string>>, // fill at call site if needed
  };
}
