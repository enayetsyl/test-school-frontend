// src/features/auth/pages/LoginPage.tsx
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "@/services/auth.api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AuthCard from "../components/AuthCard";
import { toast } from "sonner";
import { extractApiError } from "@/utils/extractApiError";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { defaultRouteForRole } from "../route-helpers";
import type { Role } from "@/types/user";

const Schema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type FormValues = z.infer<typeof Schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const role = useSelector((s: RootState) => s.auth.user?.role ?? null);

  const [login, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await login(values).unwrap();
      toast.success("Logged in");
      console.log("res", res);
      const to = defaultRouteForRole(res.user.role);
      navigate(to, { replace: true });
    } catch (e: unknown) {
      toast.error(extractApiError(e));
    }
  };
  // ✅ declarative redirect — NO navigate() during render
  if (role) {
    return <Navigate to={defaultRouteForRole(role as Role)} replace />;
  }
  return (
    <AuthCard
      title="Sign in"
      description="Access your Test_School account"
      footer={
        <div className="w-full text-sm text-muted-foreground">
          <span>New here?</span>{" "}
          <Link className="underline" to="/register">
            Create an account
          </Link>
        </div>
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

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            aria-invalid={!!errors.password}
          />
          {errors.password?.message && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Link className="text-sm underline" to="/forgot">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  );
}
