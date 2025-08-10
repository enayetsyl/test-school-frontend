// src/features/cert/components/CertificationCard.tsx
import { useMemo } from "react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { downloadBlob } from "@/utils/download";
import { useLazyGetCertificationPdfQuery } from "@/services/cert.api";
import type { ICertification } from "@/services/cert.api";
import { toast } from "sonner";
import { extractApiError } from "@/utils/extractApiError";

type Props = { cert: ICertification };

export default function CertificationCard({ cert }: Props) {
  const [getPdf, { isFetching }] = useLazyGetCertificationPdfQuery();

  const issuedLabel = useMemo(
    () => dayjs(cert.issuedAt).format("YYYY-MM-DD"),
    [cert.issuedAt],
  );

  const onDownload = async () => {
    try {
      const blob = await getPdf(cert._id).unwrap();
      downloadBlob(blob, `certificate-${cert.certificateId}.pdf`);
    } catch (e) {
      toast.error(extractApiError(e));
    }
  };

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          My Certification
          <Badge variant="outline">{cert.highestLevel}</Badge>
        </CardTitle>
        <CardDescription>
          Issued on <span className="font-medium">{issuedLabel}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="text-sm grid gap-1">
          <div>
            <span className="text-muted-foreground">Certificate ID:</span>{" "}
            <span className="font-mono">{cert.certificateId}</span>
          </div>
          {!!cert.pdfUrl && (
            <div className="text-muted-foreground break-all">
              PDF URL: <span className="font-mono">{cert.pdfUrl}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={onDownload} disabled={isFetching}>
            {isFetching ? "Preparing…" : "Download PDF"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
