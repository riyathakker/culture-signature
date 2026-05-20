import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileHeader } from "@/components/admin/AdminMobileHeader";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <AdminSidebar />
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <AdminMobileHeader />
        <main className="flex-1 p-8 pb-28 lg:pb-8">
          {children}
        </main>
        <footer className="p-8 border-t border-border/30 text-center mb-16 lg:mb-0">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">
            Culture Signature Admin Panel
          </p>
        </footer>
      </div>
      <AdminMobileNav />
    </div>
  );
}
