import HeaderLayout from "@/components/layout/HeaderLayoyt";

export default function PublicLayout({ children }) {
  return (
    // <div className="flex flex-col min-h-screen">
      <HeaderLayout>
        <main className="flex-1">{children}</main>
      </HeaderLayout>
    // </div>
  );
}
