// src/features/cert/pages/VerifyCertificationPage.tsx
import { useEffect, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useLazyVerifyCertificationQuery } from "@/services/cert.api";
import { toast } from "sonner";
import { extractApiError } from "@/utils/extractApiError";
import { Skeleton } from "@/components/ui/skeleton";

const Schema = z.object({
  certificateId: z.string().min(6, "Enter a valid ID"),
});
type FormValues = z.infer<typeof Schema>;

function useQueryId() {
  const qs = new URLSearchParams(useLocation().search);
  return qs.get("id") ?? "";
}

export default function VerifyCertificationPage() {
  const initialId = useQueryId();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { certificateId: initialId },
    mode: "onChange",
  });

  const id = watch("certificateId");

  const [verify, { data, isFetching, isError, isUninitialized, error }] =
    useLazyVerifyCertificationQuery();

  useEffect(() => {
    if (!initialId) return;
    (async () => {
      try {
        await verify(initialId).unwrap();
        toast.success("Certificate is valid");
      } catch (e) {
        toast.error(extractApiError(e));
      }
    })();
  }, [initialId, verify]);

  // const verified = data?.valid === true;
  const desc = useMemo(() => {
    if (isUninitialized && !initialId)
      return "Enter a certificate ID to verify";
    if (isFetching) return "Checking…";
    if (isError) return "Not found or invalid";
    if (data) return "Valid certificate";
    return "Enter a certificate ID to verify";
  }, [isUninitialized, initialId, isFetching, isError, data]);

  const onSubmit = async ({ certificateId }: FormValues) => {
    try {
      await verify(certificateId).unwrap();
      toast.success("Certificate is valid");
    } catch (e) {
      toast.error(extractApiError(e));
    }
  };

  const inlineError = isError ? extractApiError(error) : null;

  return (
    <div className="mx-auto w-full max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Verify Certification</CardTitle>
          <CardDescription>{desc}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="certificateId">Certificate ID</Label>
              <Input
                id="certificateId"
                {...register("certificateId")}
                aria-invalid={!!errors.certificateId}
                disabled={isFetching}
              />
              {errors.certificateId?.message && (
                <p className="text-sm text-destructive">
                  {errors.certificateId.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={!id || !isValid || isFetching}>
              {isFetching ? "Verifying…" : "Verify"}
            </Button>
            {inlineError && (
              <p role="alert" className="text-sm text-destructive">
                {inlineError}
              </p>
            )}
          </form>

          {/* Loading skeleton */}
          {isFetching && (
            <div className="rounded-md border p-3">
              <div className="grid gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          )}

          {!isFetching && data && (
            <div className="rounded-md border p-3 text-sm">
              <div>
                <span className="text-muted-foreground">Holder:</span>{" "}
                {data.user.name || "-"}
              </div>
              <div>
                <span className="text-muted-foreground">Level:</span>{" "}
                {data.highestLevel || "-"}
              </div>
              <div>
                <span className="text-muted-foreground">Issued:</span>{" "}
                {data.issuedAt
                  ? new Date(data.issuedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : "-"}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
