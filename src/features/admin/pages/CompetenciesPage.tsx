// src/features/admin/pages/CompetenciesPages.tsx
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import SearchBar from "@/components/shared/SearchBar";
import {
  useListCompetenciesQuery,
  useCreateCompetencyMutation,
  useUpdateCompetencyMutation,
  useDeleteCompetencyMutation,
  type ICompetency,
} from "@/services/competency.api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { extractApiError } from "@/utils/extractApiError";
import { usePagination } from "@/hooks/usePagination";
import TablePager from "@/components/shared/TablePager";

export default function CompetenciesPage() {
  const [params] = useSearchParams();
  const { page, limit, setPage, setLimit } = usePagination();
  const q = params.get("q") ?? undefined;

  const { data, isFetching } = useListCompetenciesQuery(
    { page, limit, q, sortBy: "createdAt", sortOrder: "desc" },
    { refetchOnMountOrArgChange: true },
  );
  const items = data?.items ?? [];
  const meta = data?.meta;

  console.log("data", data);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex md:items-center md:justify-between gap-4 flex-col md:flex-row">
        <CardTitle className="text-lg">Competencies</CardTitle>
        <div className="flex justify-between items-center gap-2 w-full md:justify-end">
          <SearchBar placeholder="Search by name/code..." />
          <CreateCompetencyDialog />
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="rounded-lg border overflow-hidden">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[700px] max-h-[70vh] overflow-y-auto">
              {/* Sticky Header */}
              <div className="sticky top-0 z-10">
                <div className="grid grid-cols-[1.2fr_2fr_3fr_1fr] border-b bg-muted/80 backdrop-blur px-4 py-2 text-sm font-medium">
                  <div>Code</div>
                  <div>Name</div>
                  <div>Description</div>
                  <div>Actions</div>
                </div>
              </div>

              {/* Table Body */}
              {isFetching ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1.2fr_2fr_3fr_1fr] items-center gap-0 px-4 py-2"
                  >
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                ))
              ) : items.length === 0 ? (
                <div className="p-6">
                  <EmptyState label="No competencies." />
                </div>
              ) : (
                items.map((c) => <Row key={c._id} c={c} />)
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

function Row({ c }: { c: ICompetency }) {
  const [open, setOpen] = useState(false);
  const [remove, { isLoading: deleting }] = useDeleteCompetencyMutation();

  const onDelete = async () => {
    try {
      await remove(c._id).unwrap();
      toast.success("Deleted");
    } catch (e: unknown) {
      toast.error(extractApiError(e));
    }
  };

  return (
    <div className="grid grid-cols-[1.2fr_2fr_3fr_1fr] items-center gap-0 border-t px-4 py-2 text-sm">
      <div className="font-mono">{c.code}</div>
      <div className="font-medium">{c.name}</div>
      <div className="text-muted-foreground line-clamp-2">
        {c.description ?? "-"}
      </div>
      <div className="flex gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </DialogTrigger>
          <EditCompetencyDialog c={c} onClose={() => setOpen(false)} />
        </Dialog>
        <Button
          size="sm"
          variant="destructive"
          onClick={onDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}

const Schema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
});
type Values = z.infer<typeof Schema>;

function CreateCompetencyDialog() {
  const [create, { isLoading }] = useCreateCompetencyMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Values>({
    resolver: zodResolver(Schema),
    defaultValues: { code: "", name: "", description: "" },
  });

  const onSubmit = async (v: Values) => {
    try {
      await create(v).unwrap();
      toast.success("Created");
      reset();
    } catch (e: unknown) {
      toast.error(extractApiError(e));
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">New</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create competency</DialogTitle>
        </DialogHeader>
        <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-1.5">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              {...register("code")}
              aria-invalid={!!errors.code}
            />
            {errors.code?.message && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name")}
              aria-invalid={!!errors.name}
            />
            {errors.name?.message && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register("description")} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditCompetencyDialog({
  c,
  onClose,
}: {
  c: ICompetency;
  onClose: () => void;
}) {
  const [update, { isLoading }] = useUpdateCompetencyMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(Schema),
    defaultValues: {
      code: c.code,
      name: c.name,
      description: c.description ?? "",
    },
  });

  const onSubmit = async (v: Values) => {
    try {
      await update({ id: c._id, patch: v }).unwrap();
      toast.success("Updated");
      onClose();
    } catch (e: unknown) {
      toast.error(extractApiError(e));
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit competency</DialogTitle>
      </DialogHeader>
      <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-1.5">
          <Label htmlFor="code">Code</Label>
          <Input id="code" {...register("code")} aria-invalid={!!errors.code} />
          {errors.code?.message && (
            <p className="text-sm text-destructive">{errors.code.message}</p>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name?.message && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Input id="description" {...register("description")} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
