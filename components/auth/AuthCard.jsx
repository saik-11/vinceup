import { cn } from "@/lib/utils";

export default function AuthCard({ maxWidth = "lg", className, children }) {
  const widths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return <div className={cn("w-full rounded-2xl bg-background p-8 shadow-xl shadow-gray-200/60 dark:shadow-gray-900/40", widths[maxWidth], className)}>{children}</div>;
}
