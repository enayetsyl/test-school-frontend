// src/store/persistConfig.ts
import storage from "redux-persist/lib/storage";
export const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"],
};
