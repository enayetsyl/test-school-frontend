import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExamQuestion, { type QuestionVM } from "../components/ExamQuestion";
import ExamTimer from "../components/ExamTimer";
import ExamProgress from "../components/ExamProgress";

import {
  useStartExamMutation,
  useAnswerMutation,
  useSubmitMutation,
} from "@/services/exam.api";
import {
  useListQuestionsQuery,
  type IQuestion,
  type QuestionLevel,
} from "@/services/question.api";

import {
  begin,
  goNext,
  goPrev,
  recordAnswer,
  reset,
  setIndex,
  setSubmitted,
  type Step,
} from "@/store/exam.slice";
import type { RootState } from "@/store/store";

import { useCountdown } from "../hooks/use-countdown";
import { useProctoring } from "../hooks/use-proctoring";
import { levelsForStep } from "../utils/step-levels";
import { toast } from "sonner";
import QuestionPalette from "../components/QuestionPalette";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// ⛔ removed FullscreenGate / useFullscreen
import { useKeyNav } from "../hooks/use-key-nav";
import { useVideoProctor } from "../hooks/use-video-proctor";
import QuestionSkeleton from "../components/QuestionSkeleton";
import { useFullscreen } from "../hooks/use-fullscreen";
import FullscreenGate from "../components/FullscreenGate";

function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
}

function getErrorMessage(e: unknown): string {
  if (typeof e === "object" && e !== null && "data" in e) {
    const data = (e as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  if (e instanceof Error) return e.message;
  return "Something went wrong";
}

const getId = (x: unknown): string => {
  const anyX = x as { _id?: string; id?: string };
  return anyX._id ?? anyX.id ?? "";
};

export default function ExamStepPage() {
  const { n } = useParams();
  const step: Step = n === "2" ? 2 : n === "3" ? 3 : 1;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const exam = useSelector((s: RootState) => s.exam);

  const [startExam, { isLoading: isStarting }] = useStartExamMutation();
  const [sendAnswer] = useAnswerMutation();
  const [submit, { isLoading: isSubmitting }] = useSubmitMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  // near other useState calls
  const [resultOpen, setResultOpen] = useState(false);
  const [result, setResult] = useState<{
    status: "submitted" | "expired" | "abandoned";
    scorePct: number;
    awardedLevel?: string;
    proceedNext: boolean;
  } | null>(null);

  const safeStep: Step = (exam?.step as Step) ?? 1;
  const nextStep: Step | null = safeStep < 3 ? ((safeStep + 1) as Step) : null;

  const goDashboard = () => navigate("/student/dashboard", { replace: true });
  const startNext = () =>
    nextStep && navigate(`/student/exam/step/${nextStep}`, { replace: true });
  const retake = () =>
    navigate(`/student/exam/step/${safeStep}`, { replace: true });

  // fetch pools (22 per level)
  const [lv1, lv2] = levelsForStep(step);
  const q1 = useListQuestionsQuery({ level: lv1 as QuestionLevel, limit: 100 });
  const q2 = useListQuestionsQuery({ level: lv2 as QuestionLevel, limit: 100 });

  // 🔹 reset ONLY when unmounting this page
  useEffect(() => {
    return () => {
      dispatch(reset());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFullscreen = useFullscreen();

  const ensureFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch {
        /* ignore */
      }
    }
  };

  // 🔹 start session ONLY when step changes
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const res = await startExam({
          step,
          screen: { width: window.innerWidth, height: window.innerHeight },
        }).unwrap();
        if (cancelled) return;

        const [r1, r2] = await Promise.all([q1.refetch(), q2.refetch()]);
        const items1 = ((r1 as { data?: { items?: IQuestion[] } }).data
          ?.items ?? []) as IQuestion[];
        const items2 = ((r2 as { data?: { items?: IQuestion[] } }).data
          ?.items ?? []) as IQuestion[];

        if (items1.length < 1 || items2.length < 1) {
          toast.error("No questions available for this step yet.");
          navigate("/student/dashboard", { replace: true });
          return;
        }

        const chosen1 = pickRandom(items1, 22);
        const chosen2 = pickRandom(items2, 22);
        const ordered = [...chosen1, ...chosen2];
        const ids = ordered.map(getId).filter(Boolean);

        if (ids.length === 0) {
          toast.error("Questions loaded but missing IDs.");
          navigate("/student/dashboard", { replace: true });
          return;
        }

        dispatch(
          begin({
            sessionId: res.sessionId,
            step,
            deadlineAt: res.deadlineAt,
            questionIds: ids,
          }),
        );

        console.log("[begin]", {
          sessionId: res.sessionId,
          step,
          deadlineAt: res.deadlineAt,
          nowISO: new Date().toISOString(),
        });
      } catch (e: unknown) {
        toast.error(getErrorMessage(e));
        navigate("/student/dashboard", { replace: true });
      }
    };

    void init();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // timer & proctoring
  const { label, expired } = useCountdown(exam.deadlineAt ?? undefined);
  useProctoring(exam.sessionId);
  useVideoProctor(exam.sessionId, exam.status === "active");

  // questions map
  const questions = useMemo(() => {
    const map = new Map<string, IQuestion>();
    (q1.data?.items ?? []).forEach((x) => map.set(getId(x), x as IQuestion));
    (q2.data?.items ?? []).forEach((x) => map.set(getId(x), x as IQuestion));
    return map;
  }, [q1.data, q2.data]);

  const currentId = exam.questionIds[exam.currentIndex];
  const current = currentId ? questions.get(currentId) : undefined;
  const selectedIndex = current
    ? exam.answers[current._id]?.selectedIndex
    : undefined;

  const answeredSet = useMemo(() => {
    const set = new Set<number>();
    exam.questionIds.forEach((id, idx) => {
      if (exam.answers[id]?.selectedIndex !== undefined) set.add(idx);
    });
    return set;
  }, [exam.answers, exam.questionIds]);

  const total = exam.questionIds.length || 44;
  const unansweredCount = total - answeredSet.size;

  // auto-submit on expiry
  useEffect(() => {
    if (!expired || !exam.sessionId || exam.status !== "active") return;
    void onSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expired]);

  // warn on unload
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (exam.status === "active") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [exam.status]);

  const onSelect = async (idx: number) => {
    if (!current || !exam.sessionId) return;
    if (exam.status !== "active") return;
    // Gate on real fullscreen state (not just hook)
    if (!document.fullscreenElement) {
      await ensureFullscreen();
      if (!document.fullscreenElement) {
        // still not granted → block answering
        return;
      }
    }
    // record locally
    dispatch(recordAnswer({ questionId: current._id, selectedIndex: idx }));

    // best-effort send with elapsed
    const elapsedMs = Math.max(
      0,
      Date.now() - (exam.currentShownAt ?? Date.now()),
    );
    try {
      await sendAnswer({
        sessionId: exam.sessionId,
        questionId: current._id,
        selectedIndex: idx,
        elapsedMs,
      }).unwrap();
    } catch {
      // ignore; UI continues
    }

    if (exam.currentIndex < exam.questionIds.length - 1) {
      dispatch(goNext());
    }
  };

  const onSubmit = async () => {
    if (!exam.sessionId) return;

    if (!document.fullscreenElement) {
      await ensureFullscreen();
      if (!document.fullscreenElement) return; // require fullscreen to submit
    }

    try {
      const res = await submit({ sessionId: exam.sessionId }).unwrap();
      dispatch(setSubmitted());

      console.log("res", res);
      setResult({
        status: res.data.status,
        scorePct: res.data.scorePct,
        awardedLevel: res.data.awardedLevel,
        proceedNext: res.data.proceedNext,
      });
      setResultOpen(true);
    } catch {
      toast.error("Could not submit. Please try again.");
    } finally {
      setConfirmOpen(false);
    }
  };

  const vm: QuestionVM | undefined = current
    ? { id: current._id, prompt: current.prompt, options: current.options }
    : undefined;

  // keyboard nav (always on now)
  useKeyNav(
    () => dispatch(goPrev()),
    () => dispatch(goNext()),
  );

  return (
    <div className="grid gap-6">
      <Card className="bg-accent/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Step {step}</span>
            <div className="flex items-center gap-2">
              <ExamProgress answered={answeredSet.size} total={total} />
              <ExamTimer
                label={label}
                danger={expired || (label.startsWith("00:") && !expired)}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={
              !isFullscreen ||
              exam.currentIndex === 0 ||
              exam.status !== "active"
            }
            onClick={() => dispatch(goPrev())}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            disabled={
              !isFullscreen ||
              exam.currentIndex >= total - 1 ||
              exam.status !== "active"
            }
            onClick={() => dispatch(goNext())}
          >
            Next
          </Button>

          <div className="flex-1" />
          <Button
            variant="destructive"
            onClick={() =>
              isFullscreen ? setConfirmOpen(true) : ensureFullscreen()
            }
            disabled={isSubmitting || isStarting}
          >
            Submit
          </Button>
        </CardContent>
      </Card>

      <FullscreenGate />
      {/* Palette */}
      <QuestionPalette
        total={total}
        currentIndex={exam.currentIndex}
        answered={answeredSet}
        onJump={(i) =>
          isFullscreen && exam.status === "active"
            ? dispatch(setIndex(i))
            : ensureFullscreen()
        }
      />

      {/* Question */}
      {vm ? (
        <ExamQuestion
          q={vm}
          selectedIndex={selectedIndex}
          onSelect={onSelect}
        />
      ) : (
        <QuestionSkeleton />
      )}

      {/* Confirm modal */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Step {step}?</AlertDialogTitle>
            <AlertDialogDescription>
              {unansweredCount > 0
                ? `You still have ${unansweredCount} unanswered ${unansweredCount === 1 ? "question" : "questions"}.`
                : "All questions answered."}{" "}
              Once submitted, you can’t change your answers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Review again
            </AlertDialogCancel>
            <AlertDialogAction onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting…" : "Yes, submit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Result modal after submission */}
      <AlertDialog
        open={resultOpen}
        // ⭐ when user closes, leave the page
        onOpenChange={(open) => {
          setResultOpen(open);
          if (!open) {
            goDashboard(); // or navigate("/student/exam/result", { replace: true })
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Step {safeStep} result</AlertDialogTitle>
            <AlertDialogDescription>
              {result ? (
                <div className="grid gap-2 text-sm">
                  <div>
                    <span className="font-medium">Status:</span> {result.status}
                  </div>
                  <div>
                    <span className="font-medium">Score:</span>{" "}
                    {result.scorePct.toFixed(2)}%
                  </div>
                  <div>
                    <span className="font-medium">Awarded level:</span>{" "}
                    {result.awardedLevel ?? "-"}
                  </div>
                  <div>
                    <span className="font-medium">Eligible for next step:</span>{" "}
                    {String(!!result.proceedNext)}
                  </div>
                </div>
              ) : (
                "Submitting…"
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            {/* ⭐ Close navigates away too */}
            <AlertDialogCancel onClick={goDashboard}>Close</AlertDialogCancel>

            <Button variant="outline" onClick={goDashboard}>
              Go to Dashboard
            </Button>

            {nextStep && result?.proceedNext ? (
              <Button onClick={startNext}>Start step {nextStep}</Button>
            ) : safeStep === 3 ? (
              <Button onClick={goDashboard}>Finish</Button>
            ) : (
              <Button onClick={retake}>Retake step {safeStep}</Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
