// src/features/exam/hooks/use-video-proctor.ts
import { useEffect, useRef } from "react";
import { useUploadVideoChunkMutation } from "@/services/exam.api";

export function useVideoProctor(sessionId?: string | null, running?: boolean) {
  const [upload] = useUploadVideoChunkMutation();
  const mediaRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const indexRef = useRef(0);

  // reset chunk counter when session changes
  useEffect(() => {
    indexRef.current = 0;
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || !running) return;

    let cancelled = false;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;

        const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
          ? "video/webm;codecs=vp9"
          : "video/webm";

        const rec = new MediaRecorder(stream, {
          mimeType: mime,
          videoBitsPerSecond: 800_000,
          audioBitsPerSecond: 64_000,
        });
        mediaRef.current = rec;

        rec.ondataavailable = async (e) => {
          if (!e.data || e.data.size === 0 || !sessionId) return;
          const idx = indexRef.current++;
          try {
            await upload({
              sessionId,
              index: idx,
              blob: e.data,
              mime,
            }).unwrap();
          } catch {
            // swallow – next chunk will keep going
          }
        };

        rec.start(5000); // 5s chunks
      } catch {
        // camera/mic blocked or not supported – ignore in dev
      }
    })();

    return () => {
      cancelled = true;
      if (mediaRef.current && mediaRef.current.state !== "inactive") {
        mediaRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      mediaRef.current = null;
    };
  }, [sessionId, running, upload]);
}
