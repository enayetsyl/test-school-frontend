import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMyCertificationQuery,
  type HighestLevel,
} from "@/services/cert.api";
import { useNavigate } from "react-router-dom";

/** Compute the next exam step from current highest level (per spec). */
function nextStepFrom(level: HighestLevel | null): 1 | 2 | 3 | null {
  if (!level) return 1;
  if (level === "A1" || level === "A2") return 2;
  if (level === "B1" || level === "B2") return 3;
  return null; // C1 or C2 => no next step
}

export function StudentDashboard() {
  const navigate = useNavigate();
  const user = useSelector((s: RootState) => s.auth.user);

  const { data, isFetching } = useMyCertificationQuery();
  const currentLevel: HighestLevel | null =
    data?.certification?.highestLevel ?? null;
  const issuedAt = data?.certification?.issuedAt ?? null;
  const nextStep = useMemo(() => nextStepFrom(currentLevel), [currentLevel]);

  const goStatus = () => navigate("/student/exam/result");
  const goCertificate = () => navigate("/student/certification");
  const goStartExam = () => {
    // If no next step (already C1/C2), send to result page instead.
    if (!nextStep) return navigate("/student/exam/result");
    navigate(`/student/exam/step/${nextStep}`);
  };

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-4">
      <Card>
        <CardHeader className="gap-1">
          <CardTitle className="text-lg">Student Dashboard</CardTitle>
          <CardDescription>
            Quick overview of your profile and exam progress.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          {/* Identity */}
          <div className="rounded-md border p-3 text-sm">
            <div>
              <span className="text-muted-foreground">Name:</span>{" "}
              <span className="font-medium">{user?.name ?? "-"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>{" "}
              <span className="font-medium">{user?.email ?? "-"}</span>
            </div>
          </div>

          {/* Certification summary */}
          <div className="grid gap-2">
            <div className="text-sm text-muted-foreground">Certification</div>

            {/* Loading */}
            {isFetching && (
              <div className="rounded-md border p-3">
                <div className="grid gap-2">
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            )}

            {/* Loaded */}
            {!isFetching && (
              <div className="rounded-md border p-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Current level:</span>{" "}
                  <span className="font-medium">{currentLevel ?? "-"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Issued:</span>{" "}
                  <span className="font-medium">
                    {issuedAt
                      ? new Date(issuedAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                      : "-"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Next step:</span>{" "}
                  <span className="font-medium">{nextStep ?? "Completed"}</span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              variant="outline"
              onClick={goStatus}
              className="sm:w-auto w-full"
            >
              See status
            </Button>
            <Button
              onClick={goStartExam}
              disabled={!nextStep}
              className="sm:w-auto w-full"
            >
              {nextStep ? `Start exam (Step ${nextStep})` : "Max level reached"}
            </Button>
            <Button
              variant="ghost"
              onClick={goCertificate}
              className="sm:w-auto w-full"
            >
              View certificate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
