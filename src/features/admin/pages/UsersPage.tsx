// src/features/admin/pages/UserPage.tsx
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  useAdminListUsersQuery,
  useAdminCreateUserMutation,
  useAdminUpdateUserMutation,
  type PublicUser,
} from "@/services/user.api";
import { toast } from "sonner";
import { extractApiError } from "@/utils/extractApiError";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePagination } from "@/hooks/usePagination";
import TablePager from "@/components/shared/TablePager";

const RoleValues = ["admin", "student", "supervisor"] as const;
const StatusValues = ["active", "disabled"] as const;

export default function UsersPage() {
  const [params, setParams] = useSearchParams();
  const { page, limit, setPage, setLimit } = usePagination();
  const q = params.get("q") ?? undefined;
  const role = (params.get("role") ?? undefined) as
    | "admin"
    | "student"
    | "supervisor"
    | undefined;
  const status = (params.get("status") ?? undefined) as
    | "active"
    | "disabled"
    | undefined;

  const { data, isFetching } = useAdminListUsersQuery({
    page,
    limit,
    q,
    role,
    status,
  });
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
      <CardHeader className="flex  justify-between gap-4 flex-col md:flex-row">
        <CardTitle className="text-lg">Users</CardTitle>
        <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
          <SearchBar placeholder="Search name/email..." />
          <Select
            value={role}
            onValueChange={(v) => setParam("role", v === "all" ? undefined : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {RoleValues.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              <SelectItem value="all">All status</SelectItem>
              {StatusValues.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <CreateUserDialog />
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="rounded-lg border overflow-hidden">
          {/* Horizontal scroll for narrow viewports */}
          <div className="w-full overflow-x-auto">
            {/* Vertical scroll area so header can stick */}
            <div className="min-w-[720px] max-h-[70vh] overflow-y-auto">
              {/* Sticky header */}
              <div className="sticky top-0 z-10">
                <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-0 border-b bg-muted/80 backdrop-blur px-4 py-2 text-sm font-medium">
                  <div>Name</div>
                  <div>Email</div>
                  <div>Role</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
              </div>

              {/* Body */}
              {isFetching ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] items-center gap-0 px-4 py-2"
                  >
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                ))
              ) : items.length === 0 ? (
                <div className="p-6">
                  <EmptyState label="No users found." />
                </div>
              ) : (
                items.map((u, i) => <UserRow key={i} u={u} />)
              )}
            </div>
          </div>
        </div>

        {!!meta && meta.pageCount > 1 && (
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

function UserRow({ u }: { u: PublicUser }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] items-center gap-0 border-t px-4 py-2 text-sm">
      <div className="font-medium">{u.name}</div>
      <div className="text-muted-foreground">{u.email}</div>
      <div className="uppercase">{u.role}</div>
      <div className="capitalize">{u.status ?? "-"}</div>
      <div className="flex gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </DialogTrigger>
          <EditUserDialog user={u} onClose={() => setOpen(false)} />
        </Dialog>
      </div>
    </div>
  );
}

const CreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["admin", "student", "supervisor"]),
  password: z.string().min(8),
});
type CreateValues = z.infer<typeof CreateSchema>;

function CreateUserDialog() {
  const [createUser, { isLoading }] = useAdminCreateUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateValues>({
    resolver: zodResolver(CreateSchema),
    defaultValues: { name: "", email: "", role: "student", password: "" },
  });

  const onSubmit = async (v: CreateValues) => {
    try {
      await createUser(v).unwrap();
      toast.success("User created");
      reset();
    } catch (e: unknown) {
      toast.error(extractApiError(e));
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">New user</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create user</DialogTitle>
        </DialogHeader>
        <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
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
          <div className="grid gap-1.5">
            <Label>Role</Label>
            <Select
              defaultValue="student"
              onValueChange={(v) => setValue("role", v as CreateValues["role"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["admin", "student", "supervisor"].map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
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

const EditSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(["admin", "student", "supervisor"]).optional(),
  status: z.enum(["active", "disabled"]).optional(),
  password: z.string().optional(),
});
type EditValues = z.infer<typeof EditSchema>;

function EditUserDialog({
  user,
  onClose,
}: {
  user: PublicUser;
  onClose: () => void;
}) {
  const [updateUser, { isLoading }] = useAdminUpdateUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EditValues>({
    resolver: zodResolver(EditSchema),
    defaultValues: { name: user.name, role: user.role, status: user.status },
  });
  console.log("user", user);

  const onSubmit = async (v: EditValues) => {
    try {
      await updateUser({ id: user._id, patch: v }).unwrap();
      toast.success("Updated");
      onClose();
    } catch (e: unknown) {
      toast.error(extractApiError(e));
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit user</DialogTitle>
      </DialogHeader>
      <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name?.message && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label>Role</Label>
          <Select
            defaultValue={user.role}
            onValueChange={(v) => setValue("role", v as EditValues["role"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RoleValues.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label>Status</Label>
          <Select
            defaultValue={user.status ?? "active"}
            onValueChange={(v) => setValue("status", v as EditValues["status"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {StatusValues.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="password">New password (optional)</Label>
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
