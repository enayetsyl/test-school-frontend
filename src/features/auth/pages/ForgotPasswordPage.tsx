// src/features/auth/pages/ForgotPasswordPage.tsx
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useForgotMutation } from "@/services/auth.api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AuthCard from "../components/AuthCard";
import { toast } from "sonner";
import { extractApiError } from "@/utils/extractApiError";
import { Link, useNavigate } from "react-router-dom";

const Schema = z.object({ email: z.string().email() });
type FormValues = z.infer<typeof Schema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [forgot, { isLoading }] = useForgotMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await forgot(values).unwrap();
      toast.success("OTP sent to your email");
      navigate(
        `/verify-otp?email=${encodeURIComponent(values.email)}&purpose=reset`,
      );
    } catch (e: unknown) {
      toast.error(extractApiError(e));
    }
  };

  return (
    <AuthCard
      title="Forgot password"
      description="We’ll send a reset code to your email"
      footer={
        <Link className="text-sm underline" to="/login">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email?.message && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send code"}
        </Button>
      </form>
    </AuthCard>
  );
}
