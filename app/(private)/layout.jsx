import AppProviders from "@/components/AppProviders";
import PrivateNavbar from "@/components/layout/PrivateNavbar";

export default function PrivateLayout({ children }) {
  return (
    <AppProviders>
      <div className="flex flex-col h-screen">
        <PrivateNavbar>{children}</PrivateNavbar>
      </div>
    </AppProviders>
  );
}
