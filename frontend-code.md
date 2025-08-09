```javascript
// commitlint.config.cjs
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-max-line-length": [2, "always", 100], // match backend: max 100 chars per body line
    "subject-case": [0], // allow any case in subject
  },
};
```

```javascript
// components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

```javascript
// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
```

```javascript
// package.json
{
  "name": "test-school-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "prepare": "husky",
    "lint": "eslint .",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit",
    "preview": "vite preview"
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.1",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-slot": "^1.2.3",
    "@reduxjs/toolkit": "^2.8.2",
    "@tailwindcss/vite": "^4.1.11",
    "@tanstack/react-table": "^8.21.3",
    "axios": "^1.11.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "dayjs": "^1.11.13",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.539.0",
    "next-themes": "^0.4.6",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-hook-form": "^7.62.0",
    "react-redux": "^9.2.0",
    "react-router-dom": "^7.8.0",
    "recharts": "^3.1.2",
    "redux-persist": "^6.0.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.3.1",
    "xlsx": "^0.18.5",
    "zod": "^4.0.16"
  },
  "devDependencies": {
    "@commitlint/cli": "^19.8.1",
    "@commitlint/config-conventional": "^19.8.1",
    "@eslint/js": "^9.32.0",
    "@types/node": "^24.2.1",
    "@types/react": "^19.1.9",
    "@types/react-dom": "^19.1.7",
    "@typescript-eslint/eslint-plugin": "^8.39.0",
    "@typescript-eslint/parser": "^8.39.0",
    "@vitejs/plugin-react": "^4.7.0",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.33.0",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^16.3.0",
    "husky": "^9.1.7",
    "lint-staged": "^16.1.5",
    "postcss": "^8.5.6",
    "prettier": "^3.6.2",
    "prettier-plugin-tailwindcss": "^0.6.14",
    "shadcn-ui": "^0.9.5",
    "tailwindcss": "^4.1.11",
    "tailwindcss-animate": "^1.0.7",
    "tw-animate-css": "^1.3.6",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.39.0",
    "vite": "^7.1.1"
  }
}

```

```javascript
// tsconfig.app.json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
 "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    },
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}

```

```javascript
// tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

```

```javascript
// tsconfig.node.json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}

```

```javascript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

```javascript
// src/app/App.tsx
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/app/ThemeProvider"; // your custom one
import { router } from "@/routes/router";

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
```

```javascript
// src/app/ThemeProvider.tsx
import { useEffect, useMemo, useState } from "react";
import { ThemeCtx, type Theme } from "./theme-context";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem("theme") as Theme | null) ?? "system";
    } catch {
      return "system";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = (t: Theme) => {
      const isDark = t === "dark" || (t === "system" && media.matches);
      root.classList.toggle("dark", isDark);
    };

    apply(theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {  void 0; }

    if (theme === "system") {
      const handler = () => apply("system");
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

```

```javascript
// src/components/forms
```

```javascript
// src/components/layouts
```

```javascript
// src/components/shared
```

```javascriptsrc/
// src/components/ui/alert.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }

```

```javascript
// src/components/ui/avatar.tsx
import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }

```

```javascript
// src/components/ui/badge.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

```

```javascript
// src/components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

```

```javascript
// src/components/ui/card.tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}

```

```javascript
// src/components/ui/checkbox.tsx
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }

```

```javascript
// src/components/ui/dialog.tsx
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}

```

```javascript
// src/components/ui/input-otp.tsx
import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }

```

```javascript
// src/components/ui/input.tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }

```

```javascript
// src/components/ui/label.tsx
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }

```

```javascript
// src/components/ui/pagination.tsx
import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}

```

```javascript
// src/components/ui/select.tsx
import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}

```

```javascript
// src/components/ui/skeleton.tsx
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }

```

```javascript
// src/components/ui/sooner.tsx
"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }

```

```javascript
// src/components/ui/textarea.tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

```

```javascript
// src/features/admin
```

```javascript
// src/features/auth/route-helpers.ts
import type { Role } from "@/types/user";

export function defaultRouteForRole(role: Role): string {
  if (role === "admin") return "/admin";
  if (role === "supervisor") return "/supervisor";
  return "/student/dashboard";
}


```

```javascript
// src/features/auth/components/authCard.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthCard({
  title,
  description,
  footer,
  children,
}: {
  title: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-md p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
        <CardContent className="grid gap-4">{children}</CardContent>
        {footer ? <CardFooter className="justify-between">{footer}</CardFooter> : null}
      </Card>
    </div>
  );
}

```

```javascript
// src/features/auth/pages/LoginPage.tsx
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "@/services/auth.api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AuthCard from "../components/AuthCard";
import { toast } from "sonner";
import { extractApiError } from "@/utils/extractApiError";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { defaultRouteForRole } from "../route-helpers";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type FormValues = z.infer<typeof Schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const role = useSelector((s: RootState) => s.auth.user?.role);

  const [login, { isLoading }] = useLoginMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await login(values).unwrap();
      toast.success("Logged in");
      const to = defaultRouteForRole(res.user.role);
      navigate(to, { replace: true });
    } catch (e: unknown) {
      toast.error(extractApiError(e));
    }
  };

  // If already logged in, push to default route
  if (role) {
    navigate(defaultRouteForRole(role), { replace: true });
    return null;
  }

  return (
    <AuthCard
      title="Sign in"
      description="Access your Test_School account"
      footer={
        <div className="w-full text-sm text-muted-foreground">
          <span>New here?</span>{" "}
          <Link className="underline" to="/register">Create an account</Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email?.message && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} aria-invalid={!!errors.password} />
          {errors.password?.message && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <Link className="text-sm underline" to="/forgot">Forgot password?</Link>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  );
}


```

```javascript
// src/features/auth/pages/RegisterPage.tsx
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRegisterMutation, useSendOtpMutation } from "@/services/auth.api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AuthCard from "../components/AuthCard";
import { toast } from "sonner";
import { extractApiError } from "@/utils/extractApiError";
import { useNavigate, Link } from "react-router-dom";

const Schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type FormValues = z.infer<typeof Schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [sendOtp] = useSendOtpMutation();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await registerUser(values).unwrap();
      await sendOtp({ email: values.email, purpose: "verify" }).unwrap();
      toast.success("Account created. We sent you a verification code.");
      navigate(`/verify-otp?email=${encodeURIComponent(values.email)}&purpose=verify`);
    } catch (e: unknown) {
      toast.error(extractApiError(e));
    }
  };

  return (
    <AuthCard
      title="Create account"
      description="Register to start your assessments"
      footer={<span className="text-sm text-muted-foreground">Already have an account? <Link className="underline" to="/login">Sign in</Link></span>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name?.message && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email?.message && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} aria-invalid={!!errors.password} />
          {errors.password?.message && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create account"}
        </Button>
      </form>
    </AuthCard>
  );
}
```

```javascript
// src/features/auth/pages/VerifyOtpPage.tsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AuthCard from "../components/AuthCard";
import { useResendOtpMutation, useVerifyOtpMutation } from "@/services/auth.api";
import { toast } from "sonner";
import { extractApiError } from "@/utils/extractApiError";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function VerifyOtpPage() {
  const q = useQuery();
  const email = q.get("email") ?? "";
  const purpose = (q.get("purpose") === "reset" ? "reset" : "verify") as "verify" | "reset";
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [verify, { isLoading }] = useVerifyOtpMutation();
  const [resend, { isLoading: isResending }] = useResendOtpMutation();

  const onVerify = async () => {
    try {
     if (purpose === "verify") {
    await verify({ email, otp: code, purpose }).unwrap(); // consumes OTP
    toast.success("Verified successfully");
    navigate("/login", { replace: true });
    return;
  }

  // purpose === "reset": DON'T verify here.
  // Just carry the code to the reset page.
  navigate(`/reset?email=${encodeURIComponent(email)}&otp=${code}`, { replace: true });
    } catch (e: unknown) {
      toast.error(extractApiError(e));
    }
  };

  const onResend = async () => {
    try {
      await resend({ email, purpose }).unwrap();
      toast.success("OTP resent");
    } catch (e: unknown) {
      toast.error(extractApiError(e));
    }
  };

  return (
    <AuthCard
      title="Verify code"
      description={`Enter the 6-digit code we sent to ${email}`}
      footer={<Link className="text-sm underline" to="/login">Back to sign in</Link>}
    >
      <div className="grid gap-3">
        <Label>One-time code</Label>
        <InputOTP value={code} onChange={setCode} maxLength={6} containerClassName="justify-center">
          <InputOTPGroup>
            {Array.from({ length: 6 }).map((_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <Button onClick={onVerify} disabled={isLoading || code.length !== 6}>
          {isLoading ? "Verifying..." : "Verify"}
        </Button>

        <Button type="button" variant="ghost" disabled={isResending} onClick={onResend}>
          {isResending ? "Resending..." : "Resend code"}
        </Button>
      </div>
    </AuthCard>
  );
}
```

```javascript
// src/features/auth/pages/ForgotPasswordPage.tsx
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useForgotMutation } from "@/services/auth.api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AuthCard from "../components/AuthCard";
import { toast } from "sonner";
import { extractApiError } from "@/utils/extractApiError";
import { Link, useNavigate } from "react-router-dom";

const Schema = z.object({ email: z.string().email() });
type FormValues = z.infer<typeof Schema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [forgot, { isLoading }] = useForgotMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await forgot(values).unwrap();
      toast.success("OTP sent to your email");
      navigate(`/verify-otp?email=${encodeURIComponent(values.email)}&purpose=reset`);
    } catch (e: unknown) {
      toast.error(extractApiError(e));
    }
  };

  return (
    <AuthCard
      title="Forgot password"
      description="We’ll send a reset code to your email"
      footer={<Link className="text-sm underline" to="/login">Back to sign in</Link>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email?.message && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send code"}
        </Button>
      </form>
    </AuthCard>
  );
}


```

```javascript
// src/features/auth/pages/ResetPasswordPage.tsx
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useResetMutation } from "@/services/auth.api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AuthCard from "../components/AuthCard";
import { toast } from "sonner";
import { extractApiError } from "@/utils/extractApiError";
import { useEffect } from "react";

function useEmailFromQuery(): {email:string; otp: string} {
  const search = new URLSearchParams(useLocation().search);
  return { email: search.get("email") ?? "", otp: search.get("otp") ?? "" };
}

const Schema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});
type FormValues = z.infer<typeof Schema>;

export default function ResetPasswordPage() {
  const { email, otp } = useEmailFromQuery();
  const navigate = useNavigate();
  const [reset, { isLoading }] = useResetMutation();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { email, otp, newPassword: "" },
  });

   useEffect(() => {
    setValue("email", email, { shouldValidate: false });
    if (otp) setValue("otp", otp, { shouldValidate: false });
  }, [email, otp, setValue]);

  // keep email field synced (read-only)
  if (email) setValue("email", email, { shouldValidate: false });

  const onSubmit = async (values: FormValues) => {
    try {
      await reset(values).unwrap();
      toast.success("Password reset. Please sign in.");
      navigate("/login", { replace: true });
    } catch (e: unknown) {
      toast.error(extractApiError(e));
    }
  };

  return (
    <AuthCard
      title="Reset password"
      description="Enter the OTP and your new password"
      footer={<Link className="text-sm underline" to="/login">Back to sign in</Link>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} readOnly />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="otp">OTP</Label>
          <Input id="otp" inputMode="numeric" maxLength={6} {...register("otp")} aria-invalid={!!errors.otp} />
          {errors.otp?.message && <p className="text-sm text-destructive">{errors.otp.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="newPassword">New password</Label>
          <Input id="newPassword" type="password" {...register("newPassword")} aria-invalid={!!errors.newPassword} />
          {errors.newPassword?.message && (
            <p className="text-sm text-destructive">{errors.newPassword.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset password"}
        </Button>
      </form>
    </AuthCard>
  );
}


```

```javascript
// src/features/auth
```

```javascript
// src/features/auth
```

```javascript
// src/features/auth
```

```javascript
// src/features/auth
```

```javascript
// src/features/exam
```

```javascript
// src/features/student
```

```javascript
// src/features/supervisor
```

```javascript
// src/hooks
```

```javascript
// src/libs/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

```

```javascript
import { baseApi } from "./baseApi";
import { setCredentials, clearAuth } from "@/store/auth.slice";
import type { RootState } from "@/store/store";
import type { AppUser } from "@/types/user";

export type RegisterBody = { name: string; email: string; password: string };
export type RegisterResult = { user: AppUser };

export type LoginBody = { email: string; password: string };
export type LoginResult = { user: AppUser; accessToken: string };

export type MeResult = { user: AppUser };

export type OtpPurpose = "verify" | "reset";
export type OtpSendBody = { email: string; purpose: OtpPurpose };
export type OtpVerifyBody = { email: string; otp: string; purpose: OtpPurpose };
export type OtpOk = { ok: boolean };

export type ForgotBody = { email: string };
export type ResetBody = { email: string; otp: string; newPassword: string };

export const authApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    // Login → sets credentials + invalidates /me so dependent screens auto-refresh
    login: b.mutation<LoginResult, LoginBody>({
      query: (body) => ({ url: "/auth/login", method: "POST", data: body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
        } catch { /* handled in UI */ }
      },
      invalidatesTags: ["Me"],
    }),

    // Register → backend returns { user } (no token)
    register: b.mutation<RegisterResult, RegisterBody>({
      query: (body) => ({ url: "/auth/register", method: "POST", data: body }),
      invalidatesTags: ["Me"],
    }),

    // Optional: manual refresh if you need it in a UI action
    refresh: b.mutation<{ accessToken: string }, void>({
      query: () => ({ url: "/auth/token/refresh", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const prev = (getState() as RootState).auth;
          if (prev?.user) dispatch(setCredentials({ user: prev.user, accessToken: data.accessToken }));
        } catch { /* interceptor/route guards will handle */ }
      },
    }),

    // OTP
    sendOtp: b.mutation<OtpOk, OtpSendBody>({
      query: (body) => ({ url: "/auth/otp/send", method: "POST", data: body }),
    }),
    verifyOtp: b.mutation<OtpOk, OtpVerifyBody>({
      query: (body) => ({ url: "/auth/otp/verify", method: "POST", data: body }),
      invalidatesTags: ["Me"],
    }),
    resendOtp: b.mutation<OtpOk, OtpSendBody>({
      query: (body) => ({ url: "/auth/otp/resend", method: "POST", data: body }),
    }),

    // Forgot/Reset
    forgot: b.mutation<OtpOk, ForgotBody>({
      query: (body) => ({ url: "/auth/forgot", method: "POST", data: body }),
    }),
    reset: b.mutation<OtpOk, ResetBody>({
      query: (body) => ({ url: "/auth/reset", method: "POST", data: body }),
    }),

    // Me / Logout
    me: b.query<MeResult, void>({
      query: () => ({ url: "/users/me" }),
      providesTags: ["Me"],
      // NOTE: This assumes baseApi unwraps to the payload under `data`.
      // If your baseApi returns the full envelope, add: transformResponse: (r: any) => r.data
    }),

    logout: b.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try { await queryFulfilled; } finally { dispatch(clearAuth()); }
      },
      invalidatesTags: ["Me"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,   // optional
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotMutation,
  useResetMutation,
  useMeQuery,
  useLogoutMutation,
} = authApi;

```

```javascript
// src/services/baseApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { api } from "@/utils/axios";

type QueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: unknown;
  params?: unknown;
  headers?: Record<string, string>;
};

export type BaseQueryError = {
  status: number;
  data: unknown;
};

const axiosBaseQuery =
  ():
  BaseQueryFn<QueryArgs, unknown, BaseQueryError> =>
  async ({ url, method = "GET", data, params, headers }) => {
    try {
      const res = await api({ url, method, data, params, headers });
      // backend wraps success in { success, data }
      return { data: (res.data as { data?: unknown })?.data ?? res.data };
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status ?? 500;
        const respData = e.response?.data ?? { message: e.message };
        return { error: { status, data: respData } };
      }
      const message = e instanceof Error ? e.message : "Unknown error";
      return { error: { status: 500, data: { message } } };
    }
  };

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Me", "Users", "Competencies", "Questions", "Sessions", "Certs", "Config"],
  endpoints: () => ({}),
});

```

```javascript
// src/services/cert.api.ts
```

```javascript
// src/services/competency.api.ts
```

```javascript
// src/services/exam.api.ts
```

```javascript
// src/services/question.api.ts
```

```javascript
// src/services/user.api.ts
```

```javascript
// src/store/auth.slice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppUser } from "@/types/user";
import { setAccessToken } from "@/utils/authToken";

type AuthState = {
  user: AppUser | null;
  accessToken: string | null;
};

const initialState: AuthState = { user: null, accessToken: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AppUser; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      setAccessToken(action.payload.accessToken);
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      setAccessToken(null);
    },
  },
});

export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;

```

```javascript
// src/store/exam.slice.ts
```

```javascript
// src/store/persistConfig.ts
import storage from "redux-persist/lib/storage";
import type { PersistConfig } from "redux-persist";

export function makePersistConfig<S>(): PersistConfig<S> {
  return {
    key: "root",
    version: 1,
    storage,
    whitelist: [] as Array<Extract<keyof S, string>>, // fill at call site if needed
  };
}

```

```javascript
// src/store/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore, type PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage";
import auth from "./auth.slice";
import ui from "./ui.slice";
import { baseApi } from "@/services/baseApi";

// 1) Build root reducer
const rootReducer = combineReducers({
  auth,
  ui,
  [baseApi.reducerPath]: baseApi.reducer,
});

// 2) Derive the exact state type from rootReducer (this is the missing type)
type RootReducerState = ReturnType<typeof rootReducer>;

// 3) Strongly-typed persist config (persist only feature slices)
const persistConfig: PersistConfig<RootReducerState> = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth", "ui"] as Array<Extract<keyof RootReducerState, string>>,
};

// 4) Wrap reducer with persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 5) Store + middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

// App-level types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

```

```javascript
// src/store/ui.slice.ts
import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
  name: "ui",
  initialState: { globalLoading: false },
  reducers: {
    startLoading: (s) => {
      s.globalLoading = true;
    },
    stopLoading: (s) => {
      s.globalLoading = false;
    },
  },
});
export const { startLoading, stopLoading } = slice.actions;
export default slice.reducer;
```

```javascript
// src/types/api.d.ts
```

```javascript
// src/types/auth.d.ts
```

```javascript
// src/types/exam.d.ts
```

```javascript
// src/types/user.ts
export type Role = "admin" | "student" | "supervisor";

// Shape returned by backend (name can be missing/null)
export type ApiUser = {
  id: string;
  email: string;
  role: Role;
  name?: string | null;
};

// Shape we keep in Redux (name always present)
export type AppUser = {
  id: string;
  email: string;
  role: Role;
  name: string;
};

export function toAppUser(u: ApiUser): AppUser {
  return {
    id: u.id,
    email: u.email,
    role: u.role,
    // fallback if name is missing/empty → use email's local-part
    name: (u.name ?? "").trim() || u.email.split("@")[0],
  };
}

```

```javascript
// src/utils/axios.ts
import axios, { type AxiosInstance, AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { getAccessToken } from "./authToken";

const BASE_URL = import.meta.env.VITE_API_URL?.toString() ?? "http://localhost:8080/api/v1";

export const api: AxiosInstance = axios.create({ baseURL: BASE_URL, withCredentials: true });

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.headers) config.headers = new AxiosHeaders();
  else if (!(config.headers instanceof AxiosHeaders)) config.headers = AxiosHeaders.from(config.headers);
  const token = getAccessToken();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});


```

```javascript
// src/utils/authToken.ts
let inMemoryToken: string | null = null;

export function setAccessToken(token: string | null): void {
  inMemoryToken = token;
  try {
    if (token) localStorage.setItem("accessToken", token);
    else localStorage.removeItem("accessToken");
  } catch {
    // localStorage may be disabled — ignore
  }
}

export function getAccessToken(): string | null {
  if (inMemoryToken) return inMemoryToken;
  try {
    return localStorage.getItem("accessToken");
  } catch {
    return null;
  }
}

```

```javascript
// src/utils/constants.ts
```

```javascript
// src/utils/data.ts
```

```javascript
// src/utils/extractApiError.ts

export type ApiErrorCode =
  | 'VALIDATION_ERROR' | 'AUTH_REQUIRED' | 'FORBIDDEN' | 'NOT_FOUND'
  | 'CONFLICT' | 'RATE_LIMITED' | 'SERVER_ERROR' | 'INVALID_CREDENTIALS'
  | 'INVALID_OTP' | 'EXAM_LOCKED' | 'SESSION_NOT_FOUND'
  | 'QUESTION_NOT_FOUND' | 'CERT_NOT_FOUND' | 'CSV_PARSE_ERROR' | 'FILE_TOO_LARGE'
  | (string & {}); // allow future codes without breaking
// ^ list documented in your API reference

export type ApiErrorResponse = {
  success: false;
  code: ApiErrorCode;
  message: string;
  // zod-like details often include `issues`, but keep this flexible
  details?: unknown;
};

export type RtkAxiosError = {
  status?: number;
  // `data` can be the server error JSON, or sometimes a string message
  data?: ApiErrorResponse | { message?: string; error?: string } | string;
};

// Small type guards (no `any` needed)
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}
function getStr(obj: unknown, key: string): string | undefined {
  return isRecord(obj) && typeof obj[key] === 'string' ? (obj[key] as string) : undefined;
}
function hasData(obj: unknown): obj is { data?: unknown } {
  return isRecord(obj) && 'data' in obj;
}

/**
 * Extract a human-readable error message from:
 * - RTK Query axiosBaseQuery errors (`{ status, data }`)
 * - plain Error
 * - arbitrary objects that might have `message` or `error`
 */
export function extractApiError(err: unknown): string {
  // RTK baseQuery axios error: prefer server-provided message
  if (hasData(err)) {
    const d = (err as { data?: unknown }).data;

    if (typeof d === 'string' && d.trim()) return d;

    if (isRecord(d)) {
      const msg = getStr(d, 'message') ?? getStr(d, 'error');
      if (msg) return msg;
    }
  }

  // Plain Error
  if (err instanceof Error && err.message) return err.message;

  // Object with a message/error field
  const fallback = getStr(err, 'message') ?? getStr(err, 'error');
  return fallback ?? 'Something went wrong';
}

/**
 * Optional helper if you want field-level messages (e.g., zod issues).
 * Returns array of strings you can show under inputs or in a list.
 */
export function extractFieldIssues(err: unknown): string[] {
  if (!hasData(err)) return [];
  const d = (err as { data?: unknown }).data;
  if (!isRecord(d) || !isRecord(d.details)) return [];

  const issues = d.details['issues'];
  if (Array.isArray(issues)) {
    return issues
      .map((it) => (isRecord(it) ? getStr(it, 'message') : undefined))
      .filter((m): m is string => !!m);
  }
  return [];
}

```

```javascript
// src/utils/guards.ts
```

```javascript
// src/App.css
```

```javascript
// src/index.css
@import "tailwindcss";

/* =========================
   Test_School – Theme (Tailwind v4)
   - Define brand scale in OKLCH
   - Semantic tokens for shadcn/ui
   - Light & Dark with WCAG-friendly contrast
   ========================= */
@theme {
  /* ----- Brand (Indigo/Blue) ----- */
  /* Chosen for trust/clarity; OKLCH keeps steps perceptually even */
  --color-brand-50:  oklch(0.97 0.02 265);
  --color-brand-100: oklch(0.93 0.03 265);
  --color-brand-200: oklch(0.88 0.05 265);
  --color-brand-300: oklch(0.81 0.08 265);
  --color-brand-400: oklch(0.74 0.11 265);
  --color-brand-500: oklch(0.66 0.14 265); /* primary base (light) */
  --color-brand-600: oklch(0.60 0.15 265);
  --color-brand-700: oklch(0.53 0.14 265);
  --color-brand-800: oklch(0.47 0.12 265);
  --color-brand-900: oklch(0.41 0.10 265);

  /* ----- Success / Warning / Destructive / Info (OKLCH) ----- */
  --color-success:     oklch(0.70 0.11 150); /* green */
  --color-success-fg:  oklch(0.16 0 0);
  --color-warning:     oklch(0.86 0.12 80);  /* amber */
  --color-warning-fg:  oklch(0.19 0 0);
  --color-destructive: oklch(0.62 0.20 25);  /* red */
  --color-destructive-fg: oklch(0.98 0 0);
  --color-info:        oklch(0.73 0.12 240); /* cyan/blue */
  --color-info-fg:     oklch(0.16 0 0);

  /* ----- Neutrals (Surfaces & Text) ----- */
  --color-background:  oklch(0.99 0 0);
  --color-foreground:  oklch(0.15 0 0);      /* ~#0a0a0a */

  --color-card:        var(--color-background);
  --color-card-foreground: var(--color-foreground);

  --color-popover:     var(--color-card);
  --color-popover-foreground: var(--color-card-foreground);

  --color-muted:       oklch(0.95 0.01 255); /* light gray (borders/bg) */
  --color-muted-foreground: oklch(0.47 0 0); /* secondary text */

  --color-accent:      oklch(0.96 0.02 265);
  --color-accent-foreground: var(--color-foreground);

  --color-primary:     var(--color-brand-600);
  --color-primary-foreground: oklch(0.98 0 0);

  --color-secondary:   oklch(0.92 0.01 255);
  --color-secondary-foreground: oklch(0.22 0 0);

  --color-border:      oklch(0.90 0.01 255);
  --color-input:       var(--color-border);
  --color-ring:        var(--color-brand-600);
}

/* Bridge to shadcn/ui variables */
:root {
  --background: var(--color-background);
  --foreground: var(--color-foreground);

  --card: var(--color-card);
  --card-foreground: var(--color-card-foreground);

  --popover: var(--color-popover);
  --popover-foreground: var(--color-popover-foreground);

  --primary: var(--color-primary);
  --primary-foreground: var(--color-primary-foreground);

  --secondary: var(--color-secondary);
  --secondary-foreground: var(--color-secondary-foreground);

  --muted: var(--color-muted);
  --muted-foreground: var(--color-muted-foreground);

  --accent: var(--color-accent);
  --accent-foreground: var(--color-accent-foreground);

  --destructive: var(--color-destructive);
  --destructive-foreground: var(--color-destructive-fg);

  --success: var(--color-success);
  --success-foreground: var(--color-success-fg);

  --warning: var(--color-warning);
  --warning-foreground: var(--color-warning-fg);

  --info: var(--color-info);
  --info-foreground: var(--color-info-fg);

  --border: var(--color-border);
  --input: var(--color-input);
  --ring: var(--color-ring);
}

/* Dark theme – tuned for AA contrast on text & UI */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background:  oklch(0.14 0 0);
    --color-foreground:  oklch(0.93 0 0);

    --color-card:        oklch(0.17 0 0);
    --color-card-foreground: var(--color-foreground);

    --color-popover:     var(--color-card);
    --color-popover-foreground: var(--color-card-foreground);

    --color-muted:       oklch(0.24 0 0);
    --color-muted-foreground: oklch(0.73 0 0);

    /* Slightly brighter primary for dark to maintain contrast */
    --color-primary:     oklch(0.74 0.11 265); /* ~brand-400 */
    --color-primary-foreground: oklch(0.15 0 0);

    --color-secondary:   oklch(0.22 0 0);
    --color-secondary-foreground: oklch(0.90 0 0);

    --color-destructive: oklch(0.70 0.18 25);
    --color-destructive-foreground: oklch(0.12 0 0);

    --color-border:      oklch(0.28 0 0);
    --color-input:       var(--color-border);
    --color-ring:        var(--color-primary);
  }
}

/* Optional: class-based dark support */
.dark {
  --color-background:  oklch(0.14 0 0);
  --color-foreground:  oklch(0.93 0 0);

  --color-card:        oklch(0.17 0 0);
  --color-card-foreground: var(--color-foreground);

  --color-popover:     var(--color-card);
  --color-popover-foreground: var(--color-card-foreground);

  --color-muted:       oklch(0.24 0 0);
  --color-muted-foreground: oklch(0.73 0 0);

  --color-primary:     oklch(0.74 0.11 265);
  --color-primary-foreground: oklch(0.15 0 0);

  --color-secondary:   oklch(0.22 0 0);
  --color-secondary-foreground: oklch(0.90 0 0);

  --color-destructive: oklch(0.70 0.18 25);
  --color-destructive-foreground: oklch(0.12 0 0);

  --color-border:      oklch(0.28 0 0);
  --color-input:       var(--color-border);
  --color-ring:        var(--color-primary);
}

/* Global body colors (optional) */
body { background: var(--background); color: var(--foreground); }

```

```javascript
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/store";

import "./index.css";
import App from "./app/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

```

```javascript
// src/vite-env.d.ts
/// <reference types="vite/client" />
```

```javascript
// src/routes/guards.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";


export function PrivateRoute() {
  const user = useSelector((s: RootState) => s.auth.user);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export function RoleGuard({ allow }: { allow: Array<"admin" | "student" | "supervisor"> }) {
  const role = useSelector((s: RootState) => s.auth.user?.role);
  return role && allow.includes(role) ? <Outlet /> : <Navigate to="/" replace />;
}

```

```javascript
// src/routes/pages.tsx
export const LoginPage = () => <div className="p-6">Login Page</div>;
export const StudentDashboard = () => (
  <div className="p-6">Student Dashboard</div>
);
```

```javascript
// src/routes/router.tsx
import { Navigate, createBrowserRouter } from "react-router-dom";
import { PrivateRoute, RoleGuard } from "@/routes/guards";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import VerifyOtpPage from "@/features/auth/pages/VerifyOtpPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import { StudentDashboard } from "@/routes/pages";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/student/dashboard" replace /> },

  // Auth
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/verify-otp", element: <VerifyOtpPage /> }, // ?email=...&purpose=verify|reset
  { path: "/forgot", element: <ForgotPasswordPage /> },
  { path: "/reset", element: <ResetPasswordPage /> }, // ?email=...

  {
    element: <PrivateRoute />,
    children: [
      { path: "/student/dashboard", element: <StudentDashboard /> },
      {
        element: <RoleGuard allow={["admin"]} />,
        children: [
          { path: "/admin", element: <div className="p-6">Admin Home</div> },
        ],
      },
    ],
  },
  { path: "*", element: <div className="p-6">404</div> },
]);
```

```javascript
// src/app/theme-context.ts
import { createContext, useContext } from "react";

export type Theme = "light" | "dark" | "system";
type Ctx = { theme: Theme; setTheme: (t: Theme) => void };

// undefined so we can throw if used outside provider
export const ThemeCtx = createContext<Ctx | undefined>(undefined);

export const useTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```
