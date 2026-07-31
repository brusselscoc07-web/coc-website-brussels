import type { ReactNode } from "react";
import { Suspense } from "react";
import SaveToastListener from "@/components/admin/SaveToastListener";
import Sidebar from "@/components/admin/Sidebar";
import ToastProvider from "@/components/admin/ToastProvider";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <Suspense fallback={null}>
        <SaveToastListener />
      </Suspense>
      <div className="min-h-screen bg-[#F2F7FB] font-sans md:flex">
        <Sidebar />
        <div className="min-w-0 flex-1 md:ml-[248px]">{children}</div>
      </div>
    </ToastProvider>
  );
}
