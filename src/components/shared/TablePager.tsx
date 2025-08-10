// src/components/shared/TablePager.tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export type PagerMeta = {
  page: number;
  limit: number;
  total: number;
  pageCount: number;
};

type Props = {
  meta: PagerMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  pageSizeOptions?: number[];
  sticky?: boolean;
};

export default function TablePager({
  meta,
  onPageChange,
  onLimitChange,
  pageSizeOptions = [10, 20, 50, 100],
  sticky = false,
}: Props) {
  const { page, pageCount, limit, total } = meta;

  return (
    <div
      className={[
        "mt-2 grid items-center gap-3",
        // 3 columns on mobile: results | arrows | size
        "grid-cols-[auto_1fr_auto]",
        // on sm and up, switch to row layout
        "sm:flex sm:flex-row sm:items-center sm:justify-between",
        // optional sticky footer
        sticky
          ? "sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2"
          : "",
      ].join(" ")}
    >
      {/* Left: results (compact on mobile) */}
      <div className="text-xs text-muted-foreground">
        {/* Mobile: only the total */}
        <span className="sm:hidden">
          {Math.min(page * limit, total)} of {total} results
        </span>
        {/* Desktop: full description */}
        <span className="hidden sm:inline">
          Showing page <span className="font-medium">{page}</span> of{" "}
          <span className="font-medium">{pageCount}</span> —{" "}
          <span className="font-medium">{total}</span> results
        </span>
      </div>

      {/* Middle: arrows (centered on mobile) */}
      <div className="justify-self-center sm:order-none">
        <Pagination>
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-label="Previous page"
                title="Previous"
                className="h-8 md:px-2"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(Math.max(1, page - 1));
                }}
              />
            </PaginationItem>

            {/* Current page / count only on sm+ to save space */}
            <span className=" text-sm md:px-2">{page}</span>

            <PaginationItem>
              <PaginationNext
                href="#"
                aria-label="Next page"
                title="Next"
                className="h-8 md:px-2"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(Math.min(pageCount, page + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Right: page size (label hidden on mobile) */}
      <div className="justify-self-end sm:justify-self-auto sm:order-none">
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Rows per page
          </span>
          <Select
            value={String(limit)}
            onValueChange={(v) => onLimitChange(Number(v))}
          >
            <SelectTrigger
              className="h-8 w-[72px] text-sm"
              aria-label="Rows per page"
              title="Rows per page"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
