// src/features/exam/components/ExamProgress.tsx
import { Badge } from "@/components/ui/badge";

export default function ExamProgress({
  answered,
  total,
}: {
  answered: number;
  total: number;
}) {
  return (
    <Badge variant="secondary" className="text-base px-3 py-1">
      {answered}/{total} answered
    </Badge>
  );
}
