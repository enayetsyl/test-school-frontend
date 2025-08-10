// src/features/exam/hooks/use-countdown.ts
import { useEffect, useMemo, useRef, useState } from "react";

export function useCountdown(deadlineIso?: string) {
  const deadline = useMemo(
    () => (deadlineIso ? new Date(deadlineIso).getTime() : null),
    [deadlineIso],
  );
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

  const msLeft = deadline ? Math.max(0, deadline - now) : 0;
  const expired = deadline ? msLeft <= 0 : false;

  const mm = Math.floor(msLeft / 60000);
  const ss = Math.floor((msLeft % 60000) / 1000);
  const label = `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;

  return { msLeft, expired, label };
}
