// src/features/exam/components/QuestionPalette.tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  total: number;
  currentIndex: number;
  answered: Set<number>;
  onJump: (index: number) => void;
};

export default function QuestionPalette({
  total,
  currentIndex,
  answered,
  onJump,
}: Props) {
  if (total <= 0) return null;

  return (
    <div className="rounded-xl border bg-card p-3">
      <div className="mb-2 text-sm font-medium">Question palette</div>
      <div className="grid grid-cols-8 gap-2 sm:grid-cols-10 md:grid-cols-12">
        {Array.from({ length: total }, (_, i) => {
          const isCurrent = i === currentIndex;
          const isAnswered = answered.has(i);
          return (
            <Button
              key={i}
              type="button"
              size="sm"
              variant={
                isCurrent ? "default" : isAnswered ? "secondary" : "outline"
              }
              className={cn(
                "h-8 w-8 p-0 font-semibold",
                isCurrent && "ring-2 ring-offset-2",
              )}
              onClick={() => onJump(i)}
              aria-current={isCurrent ? "true" : "false"}
              aria-label={`Question ${i + 1}${isAnswered ? " answered" : " not answered"}`}
            >
              {i + 1}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
