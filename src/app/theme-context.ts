// src/app/theme-context.ts
import { createContext, useContext } from "react";

export type Theme = "light" | "dark" | "system";
type Ctx = { theme: Theme; setTheme: (t: Theme) => void };

// undefined so we can throw if used outside provider
export const ThemeCtx = createContext<Ctx | undefined>(undefined);

export const useTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
