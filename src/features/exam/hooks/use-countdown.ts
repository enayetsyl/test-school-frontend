// src/features/exam/hooks/use-countdown.ts
import { useEffect, useMemo, useRef, useState } from "react";

export function useCountdown(deadlineIso?: string) {
  const deadline = useMemo(() => {
    if (!deadlineIso) {
      // debug
      // console.warn("[countdown] no deadlineIso");
      return null;
    }
    const t = new Date(deadlineIso).getTime();
    if (Number.isNaN(t)) {
      console.error("[countdown] invalid deadlineIso:", deadlineIso);
      return null;
    }
    return t;
  }, [deadlineIso]);

  const [now, setNow] = useState<number>(() => Date.now());
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!deadline) return;
    const tick = () => {
      setNow(Date.now());
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [deadline]);

  if (!deadline) {
    return { msLeft: 0, expired: false, label: "--:--" }; // clearer than 00:00 while waiting
  }

  const msLeft = Math.max(0, deadline - now);
  const expired = msLeft <= 0;

  const mm = Math.floor(msLeft / 60000);
  const ss = Math.floor((msLeft % 60000) / 1000);
  const label = `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;

  return { msLeft, expired, label };
}
