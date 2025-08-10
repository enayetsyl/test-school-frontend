// src/features/exam/pages/ExamResultPage.tsx
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Step } from "@/store/exam.slice";

type ResultState = {
  scorePct: number;
  awardedLevel: string;
  proceedNext: boolean;
  step?: Step;
};

export default function ExamResultPage() {
  const { state } = useLocation();
  const nav = useNavigate();
  const s = (state ?? {}) as Partial<ResultState>;

  const step = (s.step ?? 1) as Step;
  const nextStep: Step | null = step < 3 ? ((step + 1) as Step) : null;

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Step {step} submitted</CardTitle>
        <CardDescription>Your results are below.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="text-sm">
          <div>
            <span className="font-medium">Score:</span> {s.scorePct ?? "-"}%
          </div>
          <div>
            <span className="font-medium">Awarded level:</span>{" "}
            {s.awardedLevel ?? "-"}
          </div>
          <div>
            <span className="font-medium">
              Eligible to proceed to next step:
            </span>{" "}
            {String(!!s.proceedNext)}
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => nav("/student/dashboard", { replace: true })}>
            Go to Dashboard
          </Button>
          {nextStep && s.proceedNext ? (
            <Button
              variant="outline"
              onClick={() =>
                nav(`/student/exam/step/${nextStep}`, { replace: true })
              }
            >
              Start step {nextStep}
            </Button>
          ) : step === 3 ? (
            // Finished all three steps — no next step
            <Button
              variant="outline"
              onClick={() => nav("/student/dashboard", { replace: true })}
            >
              Finish
            </Button>
          ) : (
            // Not eligible to proceed — offer a retake of the same step
            <Button
              variant="outline"
              onClick={() =>
                nav(`/student/exam/step/${step}`, { replace: true })
              }
            >
              Retake step {step}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
