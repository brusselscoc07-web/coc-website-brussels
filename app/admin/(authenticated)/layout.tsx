import type { ReactNode } from "react";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F2F7FB] font-sans md:flex">
      <Sidebar />
      <div className="min-w-0 flex-1 md:ml-[248px]">{children}</div>
    </div>
  );
}
