// src/features/exam/components/QuestionSkeleton.tsx
import { Card, CardContent } from "@/components/ui/card";
export default function QuestionSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-3 p-6">
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}
