// src/app/App.tsx
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/app/ThemeProvider"; // your custom one
import { router } from "@/routes/router";

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
