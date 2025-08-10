// src/features/exam/hooks/use-proctoring.ts
import { useEffect, useRef } from "react";
import { useViolationMutation } from "@/services/exam.api";

type ViolationType =
  | "TAB_BLUR"
  | "FULLSCREEN_EXIT"
  | "COPY"
  | "PASTE"
  | "RIGHT_CLICK";

export function useProctoring(sessionId?: string | null) {
  const [report] = useViolationMutation();
  const lastSentAtRef = useRef<Record<ViolationType, number>>({
    TAB_BLUR: 0,
    FULLSCREEN_EXIT: 0,
    COPY: 0,
    PASTE: 0,
    RIGHT_CLICK: 0,
  });

  const throttleMs = 1500;
  const reportSafe = (type: ViolationType, meta?: Record<string, unknown>) => {
    if (!sessionId) return;
    const now = Date.now();
    const last = lastSentAtRef.current[type] ?? 0;
    if (now - last < throttleMs) return; // throttle each type
    lastSentAtRef.current[type] = now;
    void report({ sessionId, type, meta });
  };

  useEffect(() => {
    if (!sessionId) return;

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        reportSafe("TAB_BLUR", { visibilityState: "hidden" });
      }
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      reportSafe("RIGHT_CLICK");
    };

    const onKeydown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (e.ctrlKey || e.metaKey) {
        if (k === "c") {
          e.preventDefault();
          reportSafe("COPY");
        } else if (k === "v") {
          e.preventDefault();
          reportSafe("PASTE");
        }
        // Note: 'x' (cut) is NOT supported by backend enum -> ignore
      }
      if (e.key === "Escape") {
        reportSafe("FULLSCREEN_EXIT");
      }
    };

    const onCopy = () => reportSafe("COPY");
    const onPaste = () => reportSafe("PASTE");

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("contextmenu", onContextMenu, { capture: true });
    window.addEventListener("keydown", onKeydown, { capture: true });
    document.addEventListener("copy", onCopy);
    document.addEventListener("paste", onPaste);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("keydown", onKeydown);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("paste", onPaste);
    };
  }, [report, sessionId]);
}
