// src/components/shared/SearchBar.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";

export default function SearchBar({
  placeholder = "Search...",
}: {
  placeholder?: string;
}) {
  const [params, setParams] = useSearchParams();

  // URL → local state
  const urlQ = useMemo(() => params.get("q") ?? "", [params]);
  const [q, setQ] = useState<string>(urlQ);

  // keep local input in sync if URL q changes externally (back/forward etc.)
  useEffect(() => {
    setQ(urlQ);
  }, [urlQ]);

  // only reset page when *q* actually changes (debounced)
  const prevAppliedQ = useRef<string>(urlQ);
  useEffect(() => {
    const id = setTimeout(() => {
      if (q === prevAppliedQ.current) return; // nothing to do
      const next = new URLSearchParams(window.location.search); // latest params
      if (q) next.set("q", q);
      else next.delete("q");
      next.set("page", "1"); // reset page ONLY when q changed
      prevAppliedQ.current = q;
      setParams(next, { replace: true });
    }, 350);
    return () => clearTimeout(id);
  }, [q, setParams]); // ⬅️ no `params` here

  return (
    <div className="w-full max-w-sm">
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
