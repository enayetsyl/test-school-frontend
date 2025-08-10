// src/features/exam/hooks/use-key-nav.ts
import { useEffect } from "react";
export function useKeyNav(onPrev: () => void, onNext: () => void) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onPrev, onNext]);
}
