// src/features/admin/pages/SessionsPage.tsx
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import SearchBar from "@/components/shared/SearchBar";
import EmptyState from "@/components/shared/EmptyState";
import { useListSessionsQuery, type AdminSession } from "@/services/admin.api";
import { usePagination } from "@/hooks/usePagination";
import TablePager from "@/components/shared/TablePager";

// helpers to safely read id / user name from mixed shapes
type RawUser = { _id?: string; name?: string };
type RawSession = { _id?: string; userId?: RawUser } & Partial<AdminSession>;

function getSessionId(s: AdminSession | RawSession): string {
  if ("id" in s && typeof s.id === "string") return s.id;
  if ("_id" in s && typeof s._id === "string") return s._id;
  return "—";
}

function getUserName(s: AdminSession | RawSession): string {
  if ("user" in s && s.user) return s.user.name ?? s.user.id ?? "—";
  if ("userId" in s && s.userId) return s.userId.name ?? s.userId._id ?? "—";
  return "—";
}

export default function SessionsPage() {
  const [params, setParams] = useSearchParams();
  const { page, limit, setPage, setLimit } = usePagination();

  const q = params.get("q") ?? undefined;

  const status = (params.get("status") ?? undefined) as
    | AdminSession["status"]
    | undefined;
  const step = (params.get("step") ?? undefined) as "1" | "2" | "3" | undefined;

  const { data, isFetching } = useListSessionsQuery(
    {
      page,
      limit,
      q,
      status: status as AdminSession["status"],
      step: step ? (Number(step) as 1 | 2 | 3) : undefined,
    },
    { refetchOnMountOrArgChange: true },
  );

  const items = data?.items ?? [];
  const meta = data?.meta;

  const setParam = (key: string, val?: string) => {
    const next = new URLSearchParams(params);
    if (val) next.set(key, val);
    else next.delete(key);
    next.set("page", "1");
    setParams(next, { replace: true });
  };

  return (
    <Card className="bg-card border-border">
      {/* Small screens */}
      <CardHeader className="block md:hidden w-full space-y-3">
        {/* Row 1: Title + Search */}
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg whitespace-nowrap flex-2/5">
            Sessions
          </CardTitle>
          <div className="flex-3/5">
            <SearchBar placeholder="Search by user/session..." />
          </div>
        </div>

        {/* Row 2: Filters */}
        <div className="flex gap-2 justify-start">
          <Select
            value={status}
            onValueChange={(v) =>
              setParam("status", v === "all" ? undefined : v)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {["pending", "active", "submitted", "cancelled"].map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={step}
            onValueChange={(v) => setParam("step", v === "all" ? undefined : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Step" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {["1", "2", "3"].map((s) => (
                <SelectItem key={s} value={s}>
                  Step {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      {/* Large screens */}
      <CardHeader className="hidden md:flex w-full items-center justify-between gap-4">
        <CardTitle className="text-lg whitespace-nowrap">Sessions</CardTitle>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <div className="w-64">
            <SearchBar placeholder="Search by user/session..." />
          </div>

          <Select
            value={status}
            onValueChange={(v) =>
              setParam("status", v === "all" ? undefined : v)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {["pending", "active", "submitted", "cancelled"].map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={step}
            onValueChange={(v) => setParam("step", v === "all" ? undefined : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Step" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {["1", "2", "3"].map((s) => (
                <SelectItem key={s} value={s}>
                  Step {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="grid gap-3">
        <div className="rounded-lg border overflow-hidden">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[720px] max-h-[70vh] overflow-y-auto">
              {/* Sticky header */}
              <div className="sticky top-0 z-15">
                <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] border-b bg-muted/70 backdrop-blur px-4 py-2 text-sm font-medium">
                  <div>Session ID</div>
                  <div>User</div>
                  <div>Status</div>
                  <div>Step</div>
                  <div>Video Chunks</div>
                </div>
              </div>

              {isFetching ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] items-center gap-0 px-4 py-2"
                  >
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                ))
              ) : items.length === 0 ? (
                <div className="p-6">
                  <EmptyState label="No sessions found." />
                </div>
              ) : (
                items.map((s) => {
                  const id = getSessionId(s as AdminSession | RawSession);
                  const userName = getUserName(s as AdminSession | RawSession);
                  return (
                    <div
                      key={s.id}
                      className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] items-center gap-0 border-t px-4 py-2 text-sm"
                    >
                      <div className="font-mono truncate">{id}</div>
                      <div className="truncate">{userName}</div>
                      <div className="capitalize">{s.status}</div>
                      <div>{s.step}</div>
                      <div>{s.videoRecordingMeta?.chunks ?? 0}</div>
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
