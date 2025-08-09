// src/app/App.tsx
import { RouterProvider } from "react-router-dom";

import { ThemeProvider } from "./ThemeProvider";
import { Toaster } from "sonner";
import { router } from "@/routes/router";
// import { router } from "./router";

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" theme="system" />
    </ThemeProvider>
  );
}
