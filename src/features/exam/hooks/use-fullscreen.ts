// src/features/exam/hooks/use-fullscreen.ts
import { useEffect, useState } from "react";

export function useFullscreen(): boolean {
  const [isFs, setIsFs] = useState<boolean>(!!document.fullscreenElement);
  useEffect(() => {
    const onChange = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  return isFs;
}
