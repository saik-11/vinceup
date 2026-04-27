// Full-screen bare layout — intentionally no Navbar / Sidebar.
// The session room occupies the entire viewport.
export default function SessionRoomLayout({ children }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950">
      {children}
    </div>
  );
}
