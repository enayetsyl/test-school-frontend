import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import CertificationCard from "../components/CertificationCard";
import {
  useMyCertificationQuery,
  type ICertification,
  type HighestLevel,
} from "@/services/cert.api";

function nextStepFrom(level: HighestLevel | null): 1 | 2 | 3 | null {
  if (!level) return 1;
  if (level === "A1" || level === "A2") return 2;
  if (level === "B1" || level === "B2") return 3;
  return null; // C1/C2 => completed
}

export default function MyCertificationPage() {
  const navigate = useNavigate();
  const { data, isFetching, isError, error, refetch } =
    useMyCertificationQuery();

  // data?.certification may be undefined if the student has none yet
  const cert: ICertification | undefined = data?.certification ?? undefined;

  const highestLevel: HighestLevel | null = cert?.highestLevel ?? null;
  const nextStep = useMemo(() => nextStepFrom(highestLevel), [highestLevel]);

  useEffect(() => {
    if (isError) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ??
        "Failed to load certification.";
      toast.error(message);
    }
  }, [isError, error]);

  if (isFetching) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>My Certification</CardTitle>
            <CardDescription>Loading your certificate…</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-5 w-72" />
            <Skeleton className="h-10 w-40" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!cert) {
    // Empty state: no certificate yet
    return (
      <div className="mx-auto w-full max-w-3xl">
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>No certificate yet</CardTitle>
            <CardDescription>
              You haven’t completed a certification. Start your exam to earn
              one.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                nextStep
                  ? navigate(`/student/exam/step/${nextStep}`)
                  : navigate("/student/exam/result")
              }
            >
              {nextStep ? `Start exam (Step ${nextStep})` : "View status"}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/student/exam/result")}
            >
              See status
            </Button>
            <Button variant="ghost" onClick={() => refetch()}>
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Has certificate → render your existing card
  return (
    <div className="mx-auto w-full max-w-3xl">
      <CertificationCard cert={cert} />
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => navigate("/student/exam/result")}
        >
          See status
        </Button>
        <Button
          onClick={() =>
            nextStep
              ? navigate(`/student/exam/step/${nextStep}`)
              : navigate("/student/exam/result")
          }
          disabled={!nextStep}
        >
          {nextStep
            ? `Start next exam (Step ${nextStep})`
            : "Max level reached"}
        </Button>
      </div>
    </div>
  );
}
