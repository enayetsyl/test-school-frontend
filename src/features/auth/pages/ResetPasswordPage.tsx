// src/features/auth/pages/ResetPasswordPage.tsx
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useResetMutation } from "@/services/auth.api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AuthCard from "../components/AuthCard";
import { toast } from "sonner";
import { extractApiError } from "@/utils/extractApiError";
import { useEffect } from "react";

type ResetForm = {
  email: string;
  otp: string;
  newPassword: string;
};

const Schema = z.object({
  email: z.email(),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});
type FormValues = z.infer<typeof Schema>;

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [reset, { isLoading }] = useResetMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(Schema),
    defaultValues: { email: "", otp: "", newPassword: "" },
  });

  useEffect(() => {
    const emailParam = params.get("email");
    const otpParam = params.get("otp");
    if (emailParam) setValue("email", emailParam, { shouldValidate: false });
    if (otpParam) setValue("otp", otpParam, { shouldValidate: false });
  }, [params, setValue]);

  const onSubmit = async (values: FormValues) => {
    try {
      await reset(values).unwrap();
      toast.success("Password reset. Please sign in.");
      navigate("/login", { replace: true });
    } catch (e: unknown) {
      toast.error(extractApiError(e));
    }
  };

  return (
    <AuthCard
      title="Reset password"
      description="Enter the OTP and your new password"
      footer={
        <Link className="text-sm underline" to="/login">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} readOnly />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="otp">OTP</Label>
          <Input
            id="otp"
            inputMode="numeric"
            maxLength={6}
            {...register("otp")}
            aria-invalid={!!errors.otp}
          />
          {errors.otp?.message && (
            <p className="text-sm text-destructive">{errors.otp.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="newPassword">New password</Label>
          <Input
            id="newPassword"
            type="password"
            {...register("newPassword")}
            aria-invalid={!!errors.newPassword}
          />
          {errors.newPassword?.message && (
            <p className="text-sm text-destructive">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset password"}
        </Button>
      </form>
    </AuthCard>
  );
}
