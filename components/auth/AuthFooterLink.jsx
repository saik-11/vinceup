import Link from "next/link";

export default function AuthFooterLink({ text, href, label }) {
  return (
    <p className="mt-5 text-center text-sm text-muted-foreground">
      {text}{" "}
      <Link href={href} className="font-semibold text-primary hover:underline">
        {label}
      </Link>
    </p>
  );
}