// src/features/exam/pages/ExamResultPage.tsx
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { extractApiError } from "@/utils/extractApiError";
import type { Step } from "@/store/exam.slice";
import { useLatestResultQuery } from "@/services/exam.api";

type ResultState = {
  scorePct: number;
  awardedLevel?: string;
  proceedNext: boolean;
  step?: Step;
  status?: "submitted" | "expired" | "abandoned";
  submittedAt?: string;
};

function nextStepFrom(step: Step): Step | null {
  return step < 3 ? ((step + 1) as Step) : null;
}

export default function ExamResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const s = (state ?? {}) as Partial<ResultState>;

  // Consider we "have state" if any of these keys are provided with proper types
  const hasState =
    typeof s.step === "number" ||
    typeof s.scorePct === "number" ||
    typeof s.proceedNext === "boolean" ||
    typeof s.awardedLevel === "string" ||
    typeof s.status === "string";

  // Fetch latest ONLY if we don't have state
  const { data, isFetching, isError, error } = useLatestResultQuery(undefined, {
    skip: hasState,
  });

  console.log("data", data);

  useEffect(() => {
    if (isError) toast.error(extractApiError(error));
  }, [isError, error]);

  const latest = data?.latest;

  const step: Step = (
    typeof s.step === "number" ? s.step : (latest?.step ?? 1)
  ) as Step;

  const scorePct: number | null =
    typeof s.scorePct === "number"
      ? s.scorePct
      : typeof latest?.scorePct === "number"
        ? latest!.scorePct
        : null;

  const awardedLevel: string | null =
    typeof s.awardedLevel === "string"
      ? s.awardedLevel
      : (latest?.awardedLevel ?? null);

  const proceedNext: boolean =
    typeof s.proceedNext === "boolean"
      ? s.proceedNext
      : (latest?.proceedNext ?? false);

  const status: string | null =
    typeof s.status === "string" ? s.status : (latest?.status ?? null);

  const submittedAtLabel = useMemo(() => {
    const iso =
      typeof s.submittedAt === "string" ? s.submittedAt : latest?.submittedAt;
    if (!iso) return null;
    const dt = new Date(iso);
    return Number.isNaN(dt.getTime()) ? null : dt.toLocaleString();
  }, [s.submittedAt, latest?.submittedAt]);

  const nextStep = nextStepFrom(step);
  const goDashboard = () => navigate("/student/dashboard", { replace: true });
  const startNext = () =>
    nextStep && navigate(`/student/exam/step/${nextStep}`, { replace: true });
  const retake = () =>
    navigate(`/student/exam/step/${step}`, { replace: true });

  const showSkeleton = isFetching && !hasState;

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Step {step} result</CardTitle>
        <CardDescription>Your latest exam outcome.</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-3">
        {showSkeleton ? (
          <div className="grid gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-52" />
          </div>
        ) : (
          <>
            <div className="text-sm grid gap-1">
              <div>
                <span className="font-medium">Status:</span> {status ?? "-"}
              </div>
              <div>
                <span className="font-medium">Score:</span> {scorePct ?? "-"}%
              </div>
              <div>
                <span className="font-medium">Awarded level:</span>{" "}
                {awardedLevel ?? "-"}
              </div>
              <div>
                <span className="font-medium">Eligible for next step:</span>{" "}
                {String(!!proceedNext)}
              </div>
              {submittedAtLabel && (
                <div className="text-muted-foreground">
                  Submitted at: {submittedAtLabel}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={goDashboard}>Go to Dashboard</Button>

              {nextStep && proceedNext ? (
                <Button variant="outline" onClick={startNext}>
                  Start step {nextStep}
                </Button>
              ) : step === 3 ? (
                <Button variant="outline" onClick={goDashboard}>
                  Finish
                </Button>
              ) : (
                <Button variant="outline" onClick={retake}>
                  Retake step {step}
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
