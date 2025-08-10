// src/features/auth/pages/VerifyOtpPage.tsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AuthCard from "../components/AuthCard";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "@/services/auth.api";
import { toast } from "sonner";
import { extractApiError } from "@/utils/extractApiError";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function VerifyOtpPage() {
  const q = useQuery();
  const email = q.get("email") ?? "";
  const purpose = (q.get("purpose") === "reset" ? "reset" : "verify") as
    | "verify"
    | "reset";
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [verify, { isLoading }] = useVerifyOtpMutation();
  const [resend, { isLoading: isResending }] = useResendOtpMutation();

  const onVerify = async () => {
    try {
      if (purpose === "verify") {
        await verify({ email, otp: code, purpose }).unwrap(); // consumes OTP
        toast.success("Verified successfully");
        navigate("/login", { replace: true });
        return;
      }

      // purpose === "reset": DON'T verify here.
      // Just carry the code to the reset page.
      navigate(`/reset?email=${encodeURIComponent(email)}&otp=${code}`, {
        replace: true,
      });
    } catch (e: unknown) {
      toast.error(extractApiError(e));
    }
  };

  const onResend = async () => {
    try {
      await resend({ email, purpose }).unwrap();
      toast.success("OTP resent");
    } catch (e: unknown) {
      toast.error(extractApiError(e));
    }
  };

  return (
    <AuthCard
      title="Verify code"
      description={`Enter the 6-digit code we sent to ${email}`}
      footer={
        <Link className="text-sm underline" to="/login">
          Back to sign in
        </Link>
      }
    >
      <div className="grid gap-3">
        <Label>One-time code</Label>
        <InputOTP
          value={code}
          onChange={setCode}
          maxLength={6}
          containerClassName="justify-center"
        >
          <InputOTPGroup>
            {Array.from({ length: 6 }).map((_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <Button onClick={onVerify} disabled={isLoading || code.length !== 6}>
          {isLoading ? "Verifying..." : "Verify"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          disabled={isResending}
          onClick={onResend}
        >
          {isResending ? "Resending..." : "Resend code"}
        </Button>
      </div>
    </AuthCard>
  );
}
