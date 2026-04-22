import Image from "next/image";
import vinceup_logo from "@/public/assets/vinceup_logo.svg";

// Default icon = VinceUp logo in a primary-colored box
function DefaultIcon() {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
      <Image src={vinceup_logo} alt="VinceUp" className="h-8 w-8 object-contain brightness-0 invert" loading="eager" />
    </div>
  );
}

// Gradient icon for forgot/reset pages
export function GradientIcon({ children }) {
  return <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-lg">{children}</div>;
}

export default function AuthHeader({
  title,
  subtitle,
  icon, // pass a custom icon element, or omit for default logo
}) {
  return (
    <div className="mb-8 flex flex-col items-center gap-3 text-center">
      {icon ?? <DefaultIcon />}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}
