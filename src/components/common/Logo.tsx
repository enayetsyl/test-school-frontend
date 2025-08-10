// src/components/common/Logo.tsx
import { NavLink } from "react-router-dom";

type Props = {
  className?: string;
  to?: string;
  withText?: boolean;
  imgClassName?: string;
};

export default function Logo({
  className = "",
  to = "/",
  withText = true,
  imgClassName = "h-8 w-8",
}: Props) {
  return (
    <NavLink
      to={to}
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label="Go home"
    >
      <img
        src="/logo.png"
        alt="Test_School logo"
        className={`${imgClassName} rounded-md`}
        loading="eager"
        decoding="async"
        draggable={false}
      />
      {withText && (
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-brand-900 to-brand-600 bg-clip-text text-transparent">
          Test_School
        </span>
      )}
    </NavLink>
  );
}
