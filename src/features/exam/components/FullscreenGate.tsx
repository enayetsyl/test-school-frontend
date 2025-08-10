// src/features/exam/components/FullscreenGate.tsx
import { Button } from "@/components/ui/button";
import { useFullscreen } from "../hooks/use-fullscreen";

export default function FullscreenGate() {
  const isFs = useFullscreen();
  if (isFs) return null; // important: unmount overlay in fullscreen

  const enter = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-background/80 backdrop-blur">
      <div className="rounded-lg border bg-card p-6 text-center shadow">
        <p className="mb-3 font-medium">
          Please enter fullscreen to continue the exam.
        </p>
        <Button onClick={enter}>Enter fullscreen</Button>
      </div>
    </div>
  );
}
