// src/features/exam/components/ExamTimer.tsx
import { Badge } from "@/components/ui/badge";

export default function ExamTimer({
  label,
  danger,
}: {
  label: string;
  danger?: boolean;
}) {
  return (
    <Badge
      variant={danger ? "destructive" : "outline"}
      className="text-base px-3 py-1"
    >
      ⏱ {label}
    </Badge>
  );
}
