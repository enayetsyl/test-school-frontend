// src/components/layouts/AuthHeader.tsx

import Logo from "@/components/common/Logo";

export default function AuthHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Logo className="shrink-0" withText={true} />
      </div>
    </header>
  );
}
