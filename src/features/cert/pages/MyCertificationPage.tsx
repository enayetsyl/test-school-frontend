// src/features/cert/pages/MyCertificationPage.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import CertificationCard from "../components/CertificationCard";
import { useMyCertificationQuery } from "@/services/cert.api";

export default function MyCertificationPage() {
  const { data, isLoading } = useMyCertificationQuery();

  if (isLoading) {
    return (
      <Card className="max-w-xl">
        <CardContent className="p-6">
          <div className="h-5 w-2/3 animate-pulse rounded bg-muted mb-4" />
          <div className="h-10 w-40 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  const cert = data?.certification ?? null;

  return cert ? (
    <CertificationCard cert={cert} />
  ) : (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>No certification yet</CardTitle>
        <CardDescription>
          Complete the 3-step assessment to earn a certification. (A PDF can be
          generated after you achieve at least A1.)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button asChild variant="outline">
          <Link to="/student/exam/step/1">Start Step 1</Link>
        </Button>
        <Button asChild>
          <Link to="/certifications/verify">Verify a certificate</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
