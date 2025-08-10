// src/features/admin/pages/QuestionPage.tsx
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
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
import SearchBar from "@/components/shared/SearchBar";
import EmptyState from "@/components/shared/EmptyState";
import {
  useListQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useImportQuestionsMutation,
  useExportQuestionsQuery,
  type IQuestion,
  type QuestionLevel,
  type CreateQuestionDto,
} from "@/services/question.api";
import { useListCompetenciesQuery } from "@/services/competency.api";
import { toast } from "sonner";
import { extractApiError } from "@/utils/extractApiError";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { downloadBlob } from "@/utils/download";
import { usePagination } from "@/hooks/usePagination";
import TablePager from "@/components/shared/TablePager";

const LevelValues: QuestionLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function QuestionsPage() {
  const [params, setParams] = useSearchParams();
  const { page, limit, setPage, setLimit } = usePagination();
  const q = params.get("q") ?? undefined;
  const level = (params.get("level") ?? undefined) as QuestionLevel | undefined;
  const competencyId = params.get("competencyId") ?? undefined;

  const { data: comps } = useListCompetenciesQuery({ limit: 100 });

  const { data, isFetching } = useListQuestionsQuery(
    {
      page,
      limit,
      q,
      level,
      competencyId,
      sortBy: "createdAt",
      sortOrder: "desc",
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

  // Export (lazy-ish via skip toggle)
  const [doExport, setDoExport] = useState(false);
  const { data: exportBlob, isFetching: isExporting } = useExportQuestionsQuery(
    undefined,
    { skip: !doExport },
  );
  useEffect(() => {
    if (doExport && exportBlob) {
      downloadBlob(exportBlob, "questions.csv");
      setDoExport(false);
      toast.success("Export started");
    }
  }, [doExport, exportBlob]);

  return (
    <Card className="bg-card border-border w-full">
      {/* Small screens */}
      <CardHeader className="block md:hidden w-full space-y-3">
        {/* Row 1: Title */}
        <CardTitle className="text-lg">Questions</CardTitle>

        {/* Row 2: Search | Level | Competency */}
        <div className="flex justify-around items-center gap-2">
          <SearchBar placeholder="Search prompt..." />
          <Select
            value={level}
            onValueChange={(v) =>
              setParam("level", v === "all" ? undefined : v)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              {LevelValues.map((lv) => (
                <SelectItem key={lv} value={lv}>
                  {lv}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={competencyId}
            onValueChange={(v) =>
              setParam("competencyId", v === "all" ? undefined : v)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Competency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All competencies</SelectItem>
              {(comps?.items ?? []).map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.code} — {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Row 3: New | Import CSV | Export CSV */}
        <div className="flex justify-around items-center gap-2">
          <CreateQuestionDialog />
          <ImportButton />
          <Button
            variant="outline"
            onClick={() => setDoExport(true)}
            disabled={isExporting}
          >
            {isExporting ? "Exporting..." : "Export CSV"}
          </Button>
        </div>
      </CardHeader>

      {/* Medium+ screens */}
      <CardHeader className="hidden md:flex  flex-col justify-between items-start gap-3 ">
        {/* Row 1: Title | Search | Level | Competency */}
        <div className="flex justify-between items-center w-full gap-4">
          <CardTitle className="text-lg whitespace-nowrap flex-2/6">
            Questions
          </CardTitle>
          <div className="flex flex-4/6 items-center justify-end gap-2">
            <SearchBar placeholder="Search prompt..." />
            <Select
              value={level}
              onValueChange={(v) =>
                setParam("level", v === "all" ? undefined : v)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                {LevelValues.map((lv) => (
                  <SelectItem key={lv} value={lv}>
                    {lv}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={competencyId}
              onValueChange={(v) =>
                setParam("competencyId", v === "all" ? undefined : v)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Competency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All competencies</SelectItem>
                {(comps?.items ?? []).map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.code} — {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 2: New | Import CSV | Export CSV */}
        <div className="flex items-center gap-2">
          <CreateQuestionDialog />
          <ImportButton />
          <Button
            variant="outline"
            onClick={() => setDoExport(true)}
            disabled={isExporting}
          >
            {isExporting ? "Exporting..." : "Export CSV"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid gap-3">
        <div className="rounded-lg border overflow-hidden">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[700px] max-h-[70vh] overflow-y-auto">
              {/* Sticky Header */}
              <div className="sticky top-0 z-10">
                <div className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr] border-b bg-muted/80 backdrop-blur px-4 py-2 text-sm font-medium gap-3">
                  <div>Competency</div>
                  <div>Prompt</div>
                  <div>Level</div>
                  <div>Active</div>
                  <div>Actions</div>
                </div>
              </div>

              {/* Table Body */}
              {isFetching ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-0 px-4 py-2"
                  >
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                ))
              ) : items.length === 0 ? (
                <div className="p-6">
                  <EmptyState label="No questions yet." />
                </div>
              ) : (
                items.map((q) => <Row key={q._id} q={q} />)
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

function Row({ q }: { q: IQuestion }) {
  const [open, setOpen] = useState(false);
  const [remove, { isLoading: deleting }] = useDeleteQuestionMutation();
  const onDelete = async () => {
    try {
      await remove(q._id).unwrap();
      toast.success("Deleted");
    } catch (e: unknown) {
      toast.error(extractApiError(e));
    }
  };

  return (
    <div className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-3 border-t px-4 py-2 text-sm">
      <div className="font-mono">{q.competencyId.name}</div>
      <div className="line-clamp-2 truncate">{q.prompt}</div>
      <div>{q.level}</div>
      <div>{q.isActive ? "Yes" : "No"}</div>
      <div className="flex gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </DialogTrigger>
          <EditQuestionDialog q={q} onClose={() => setOpen(false)} />
        </Dialog>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}

const QuestionSchema = z.object({
  competencyId: z.string().min(1),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  prompt: z.string().min(1),
  options: z.array(z.string().min(1)).length(4),
  correctIndex: z.number().int().min(0).max(3),
  isActive: z.boolean().default(true),
});
type QuestionForm = z.input<typeof QuestionSchema>;

function CreateQuestionDialog() {
  const [create, { isLoading }] = useCreateQuestionMutation();
  const { data: comps } = useListCompetenciesQuery({ limit: 100 });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<QuestionForm>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      competencyId: "",
      level: "A1",
      prompt: "",
      options: ["", "", "", ""],
      correctIndex: 0,
      isActive: true,
    },
  });

  // type CreateQuestionInput = Omit<IQuestion, "_id" | "createdAt" | "updatedAt">;

  const onSubmit = async (v: QuestionForm) => {
    const payload: CreateQuestionDto = {
      competencyId: v.competencyId,
      level: v.level,
      prompt: v.prompt,
      options: v.options,
      correctIndex: v.correctIndex,
      isActive: v.isActive ?? true,
    };

    try {
      await create(payload).unwrap();
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create question</DialogTitle>
        </DialogHeader>
        <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-1.5">
            <Label>Competency</Label>
            <Select onValueChange={(v) => setValue("competencyId", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select competency" />
              </SelectTrigger>
              <SelectContent>
                {(comps?.items ?? []).map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.code} — {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.competencyId?.message && (
              <p className="text-sm text-destructive">
                {errors.competencyId.message}
              </p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label>Level</Label>
            <Select
              defaultValue="A1"
              onValueChange={(v) =>
                setValue("level", v as QuestionForm["level"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["A1", "A2", "B1", "B2", "C1", "C2"].map((lv) => (
                  <SelectItem key={lv} value={lv}>
                    {lv}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="prompt">Prompt</Label>
            <Input
              id="prompt"
              {...register("prompt")}
              aria-invalid={!!errors.prompt}
            />
            {errors.prompt?.message && (
              <p className="text-sm text-destructive">
                {errors.prompt.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Options</Label>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="rounded border px-2 py-1 text-xs">
                  {String.fromCharCode(65 + i)}
                </span>
                <Input
                  {...register(`options.${i}`)}
                  aria-invalid={!!errors.options?.[i]}
                />
              </div>
            ))}
            {typeof errors.correctIndex?.message === "string" && (
              <p className="text-sm text-destructive">
                {errors.correctIndex.message}
              </p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label>Correct answer</Label>
            <Select
              defaultValue="0"
              onValueChange={(v) => setValue("correctIndex", Number(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3].map((i) => (
                  <SelectItem key={i} value={String(i)}>
                    {String.fromCharCode(65 + i)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

function EditQuestionDialog({
  q,
  onClose,
}: {
  q: IQuestion;
  onClose: () => void;
}) {
  const [update, { isLoading }] = useUpdateQuestionMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<QuestionForm>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      competencyId: q.competencyId._id,
      level: q.level,
      prompt: q.prompt,
      options: q.options,
      correctIndex: q.correctIndex,
      isActive: q.isActive,
    },
  });

  const onSubmit = async (v: QuestionForm) => {
    try {
      await update({ id: q._id, patch: v }).unwrap();
      toast.success("Updated");
      onClose();
    } catch (e: unknown) {
      toast.error(extractApiError(e));
    }
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Edit question</DialogTitle>
      </DialogHeader>
      <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-1.5">
          <Label htmlFor="prompt">Prompt</Label>
          <Input
            id="prompt"
            {...register("prompt")}
            aria-invalid={!!errors.prompt}
          />
        </div>
        <div className="grid gap-1.5">
          <Label>Level</Label>
          <Select
            defaultValue={q.level}
            onValueChange={(v) => setValue("level", v as QuestionForm["level"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LevelValues.map((lv) => (
                <SelectItem key={lv} value={lv}>
                  {lv}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Options</Label>
          {q.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="rounded border px-2 py-1 text-xs">
                {String.fromCharCode(65 + i)}
              </span>
              <Input
                defaultValue={opt}
                onChange={(e) => setValue(`options.${i}`, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="grid gap-1.5">
          <Label>Correct answer</Label>
          <Select
            defaultValue={String(q.correctIndex)}
            onValueChange={(v) => setValue("correctIndex", Number(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3].map((i) => (
                <SelectItem key={i} value={String(i)}>
                  {String.fromCharCode(65 + i)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

function ImportButton() {
  const [importCsv, { isLoading }] = useImportQuestionsMutation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [inputKey, setInputKey] = useState(0);

  const openPicker = () => {
    const el = fileRef.current;
    if (!el) return;
    // Ensure onChange will fire even if user picks the same file
    el.value = "";
    el.click();
  };

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return; // user canceled; nothing to upload
    try {
      await importCsv({ file, mode: "upsert" }).unwrap();
      toast.success("Imported");
    } catch (err: unknown) {
      toast.error(extractApiError(err));
    } finally {
      // Clear again after a successful/failed upload
      if (fileRef.current) fileRef.current.value = "";
      // Optional: hard reset the input node in some stubborn browsers
      setInputKey((k) => k + 1);
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <Button variant="outline" onClick={openPicker} disabled={isLoading}>
        {isLoading ? "Importing..." : "Import CSV"}
      </Button>
      <input
        key={inputKey}
        ref={fileRef}
        type="file"
        accept=".csv,text/csv"
        className="sr-only"
        onChange={onPick}
      />
    </div>
  );
}
