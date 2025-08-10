// src/app/ThemeProvider.tsx
import { useEffect, useMemo, useState } from "react";
import { ThemeCtx, type Theme } from "./theme-context";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem("theme") as Theme | null) ?? "system";
    } catch {
      return "system";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = (t: Theme) => {
      const isDark = t === "dark" || (t === "system" && media.matches);
      root.classList.toggle("dark", isDark);
    };

    apply(theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      void 0;
    }

    if (theme === "system") {
      const handler = () => apply("system");
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}
