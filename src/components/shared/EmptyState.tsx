// src/components/shared/EmptyState.tsx
export default function EmptyState({ label }: { label: string }) {
  return (
    <div className="border rounded-lg p-8 text-center text-muted-foreground">
      {label}
    </div>
  );
}
