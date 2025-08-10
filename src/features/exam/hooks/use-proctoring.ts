// src/features/exam/hooks/use-proctoring.ts  ← NEW
import { useEffect } from "react";
import { useViolationMutation } from "@/services/exam.api";

export function useProctoring(sessionId?: string | null) {
  const [report] = useViolationMutation();

  useEffect(() => {
    if (!sessionId) return;

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        void report({
          sessionId,
          type: "TAB_BLUR",
          meta: { visibilityState: "hidden" },
        });
      }
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      void report({ sessionId, type: "RIGHT_CLICK" });
    };

    const onKeydown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ["c", "v", "x"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        void report({ sessionId, type: "COPY_PASTE", meta: { key: e.key } });
      }
      if (e.key === "Escape") {
        void report({ sessionId, type: "FULLSCREEN_EXIT" });
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("contextmenu", onContextMenu, { capture: true });
    window.addEventListener("keydown", onKeydown, { capture: true });

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("keydown", onKeydown);
    };
  }, [report, sessionId]);
}
