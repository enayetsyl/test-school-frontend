// src/features/exam/components/ExamQuestion.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type QuestionVM = {
  id: string;
  prompt: string;
  options: string[];
};

export default function ExamQuestion({
  q,
  selectedIndex,
  onSelect,
}: {
  q: QuestionVM;
  selectedIndex?: number;
  onSelect: (index: number) => void;
}) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg">{q.prompt}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {q.options.map((opt, idx) => (
          <Button
            key={idx}
            type="button"
            variant={selectedIndex === idx ? "default" : "outline"}
            className="justify-start"
            onClick={() => onSelect(idx)}
          >
            <span className="mr-2 rounded-md border px-2 py-0.5 text-xs">
              {String.fromCharCode(65 + idx)}
            </span>
            {opt}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
