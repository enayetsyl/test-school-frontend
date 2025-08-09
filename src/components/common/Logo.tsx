import { NavLink } from "react-router-dom";

type Props = {
  className?: string;
  to?: string;
  withText?: boolean; // show "Test_School" text next to the logo
  imgClassName?: string; // size/tailwind classes for the image
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
        src="/logo.png" // served from /public
        alt="Test_School logo"
        className={`${imgClassName} rounded-md`}
        loading="eager"
        decoding="async"
        draggable={false}
      />
      {withText && (
        <span className="text-lg font-semibold tracking-tight">
          Test_School
        </span>
      )}
    </NavLink>
  );
}
