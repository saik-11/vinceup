import { cn } from "@/lib/utils";

export default function AuthCard({ maxWidth = "xl", className, children }) {
  const widths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return <div className={cn("w-full mx-auto rounded-2xl bg-background p-6 sm:p-8 md:p-10 shadow-xl shadow-gray-200/60 dark:shadow-gray-900/40", widths[maxWidth], className)}>{children}</div>;
}
