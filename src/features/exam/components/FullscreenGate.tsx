// src/features/exam/components/FullscreenGate.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function FullscreenGate() {
  const [isFs, setIsFs] = useState<boolean>(!!document.fullscreenElement);
  useEffect(() => {
    const onChange = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  if (isFs) return null;

  const enter = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // ignored
    }
  };

  return (
    <Card className="p-4 border-dashed">
      <div className="mb-2 font-medium">
        Enter fullscreen to start/continue the exam
      </div>
      <Button onClick={enter}>Enter fullscreen</Button>
    </Card>
  );
}
