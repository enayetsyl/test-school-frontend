// src/features/admin/pages/AuditLogsPage.tsx
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import SearchBar from "@/components/shared/SearchBar";
import EmptyState from "@/components/shared/EmptyState";
import { useListAuditLogsQuery } from "@/services/admin.api";
import { usePagination } from "@/hooks/usePagination";
import TablePager from "@/components/shared/TablePager";

type ActorObj =
  | { id: string; name?: string; email?: string; role?: string }
  | null
  | undefined;

type RawLog = {
  _id?: string;
  id?: string;
  action: string;
  resource?: string | null;
  resourceId?: string | null;
  message?: string | null; // still allowed in payload but no longer displayed
  createdAt: string;
  actor?: ActorObj | string | null;
};

function actorName(a: ActorObj | string | null | undefined): string {
  if (!a) return "-";
  if (typeof a === "string") return a || "-";
  return a.name ?? a.id ?? "-";
}
function actorRole(a: ActorObj | string | null | undefined): string {
  if (!a || typeof a === "string") return "-";
  return a.role ?? "-";
}
function actorEmail(a: ActorObj | string | null | undefined): string {
  if (!a || typeof a === "string") return "-";
  return a.email ?? "-";
}

function resourceLabel(
  resource?: string | null,
  resourceId?: string | null,
): string {
  if (!resource && !resourceId) return "-";
  if (!resource) return resourceId ?? "-";
  if (!resourceId) return resource;
  const short =
    resourceId.length > 8 ? `${resourceId.slice(0, 6)}…` : resourceId;
  return `${resource} · ${short}`;
}

export default function AuditLogsPage() {
  const [params] = useSearchParams();
  const { page, limit, setPage, setLimit } = usePagination();

  const q = params.get("q") ?? undefined;

  const { data, isFetching } = useListAuditLogsQuery(
    { page, limit, q },
    { refetchOnMountOrArgChange: true },
  );

  const items = (data?.items ?? []) as ReadonlyArray<RawLog>;

  const meta = data?.meta;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex items-center justify-between gap-4 ">
        <CardTitle className="text-lg flex-3/4">Audit Logs</CardTitle>
        <SearchBar placeholder="Search logs..." />
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="rounded-lg border overflow-hidden">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[800px] max-h-[70vh] overflow-y-auto">
              {/* Table header (sticky) */}
              <div className="sticky top-0 z-10">
                <div className="grid grid-cols-[1.6fr_1fr_1.8fr_1.6fr_1.4fr_1.4fr] border-b bg-muted/80 backdrop-blur px-4 py-2 text-sm font-medium">
                  <div>Actor</div>
                  <div>Role</div>
                  <div>Email</div>
                  <div>Action</div>
                  <div>Resource</div>
                  <div>Created at</div>
                </div>
              </div>

              {/* Table body */}
              {isFetching ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1.6fr_1fr_1.8fr_1.6fr_1.4fr_1.4fr] items-center gap-0 px-4 py-2"
                  >
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-44" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))
              ) : items.length === 0 ? (
                <div className="p-6">
                  <EmptyState label="No logs found." />
                </div>
              ) : (
                items.map((a) => {
                  const key = (a._id ?? a.id) as string;
                  const created = new Date(a.createdAt).toLocaleString();
                  return (
                    <div
                      key={key}
                      className="grid grid-cols-[1.6fr_1fr_1.8fr_1.6fr_1.4fr_1.4fr] items-center gap-0 border-t px-4 py-2 text-sm"
                    >
                      <div className="truncate">{actorName(a.actor)}</div>
                      <div className="truncate capitalize">
                        {actorRole(a.actor)}
                      </div>
                      <div className="truncate">{actorEmail(a.actor)}</div>
                      <div className="font-mono truncate">{a.action}</div>
                      <div className="truncate">
                        {resourceLabel(a.resource)}
                      </div>
                      <div className="text-muted-foreground">{created}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {meta && meta.pageCount > 1 && (
          <TablePager
            meta={meta}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        )}
      </CardContent>
    </Card>
  );
}
