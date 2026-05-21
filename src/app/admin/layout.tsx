import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileHeader } from "@/components/admin/AdminMobileHeader";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#fcfcfc] min-h-screen overflow-x-hidden">
      <AdminSidebar />
      <div className="lg:ml-64 flex flex-col min-h-screen [overflow-x:clip]">
        <AdminMobileHeader />
        <main className="flex-1 p-4 md:p-8 pb-28 lg:pb-8 overflow-x-hidden w-full min-w-0">
          {children}
        </main>
      </div>
      <AdminMobileNav />
    </div>
  );
}
