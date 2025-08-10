// src/features/admin/pages/ConfigPage.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetConfigQuery,
  useUpdateConfigMutation,
} from "@/services/admin.api";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const Schema = z.object({
  timePerQuestionSec: z.coerce.number().int().min(10).max(600),
  retakeLockMinutes: z.coerce
    .number()
    .int()
    .min(0)
    .max(24 * 60),
  maxRetakes: z.coerce.number().int().min(0).max(10),
  sebMode: z.enum(["enforce", "warn", "off"]),
});

// 2) Use input/output helpers
type FormInput = z.input<typeof Schema>; // what RHF expects (can be strings/unknown before coercion)
type FormOutput = z.output<typeof Schema>; // what your API needs (numbers after coercion)

export default function ConfigPage() {
  const { data, isFetching } = useGetConfigQuery();
  const [update, { isLoading }] = useUpdateConfigMutation();

  const cfg = data ?? undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormInput>({
    resolver: zodResolver(Schema), // resolver is typed as Resolver<input, any, output>
    values: cfg
      ? {
          // values can be numbers (that’s fine for an 'unknown' input)
          timePerQuestionSec: cfg.timePerQuestionSec,
          retakeLockMinutes: cfg.retakeLockMinutes,
          maxRetakes: cfg.maxRetakes,
          sebMode: cfg.sebMode,
        }
      : undefined,
  });

  const onSubmit: SubmitHandler<FormInput> = async (raw) => {
    const v: FormOutput = Schema.parse(raw); // now v has proper numbers
    await update(v).unwrap();
    toast.success("Config updated");
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg">System Config</CardTitle>
      </CardHeader>
      <CardContent>
        {isFetching && !cfg ? (
          <div className="grid gap-3 max-w-lg">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-9 w-full" />
          </div>
        ) : cfg ? (
          <form
            className="grid max-w-lg gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-1.5">
              <Label htmlFor="timePerQuestionSec">
                Time per question (sec)
              </Label>
              <Input
                id="timePerQuestionSec"
                inputMode="numeric"
                {...register("timePerQuestionSec")}
                aria-invalid={!!errors.timePerQuestionSec}
              />
              {errors.timePerQuestionSec?.message && (
                <p className="text-sm text-destructive">
                  {errors.timePerQuestionSec.message}
                </p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="retakeLockMinutes">Retake lock (minutes)</Label>
              <Input
                id="retakeLockMinutes"
                inputMode="numeric"
                {...register("retakeLockMinutes")}
                aria-invalid={!!errors.retakeLockMinutes}
              />
              {errors.retakeLockMinutes?.message && (
                <p className="text-sm text-destructive">
                  {errors.retakeLockMinutes.message}
                </p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="maxRetakes">Max retakes</Label>
              <Input
                id="maxRetakes"
                inputMode="numeric"
                {...register("maxRetakes")}
                aria-invalid={!!errors.maxRetakes}
              />
              {errors.maxRetakes?.message && (
                <p className="text-sm text-destructive">
                  {errors.maxRetakes.message}
                </p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label>SEB mode</Label>
              <Select
                defaultValue={cfg.sebMode}
                onValueChange={(v) =>
                  setValue("sebMode", v as FormInput["sebMode"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enforce">enforce</SelectItem>
                  <SelectItem value="warn">warn</SelectItem>
                  <SelectItem value="off">off</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-sm text-destructive">Could not load config.</div>
        )}
      </CardContent>
    </Card>
  );
}
