import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileSidebar } from "./mobile-sidebar";
import { useSidebarStore } from "@/stores/useSidebarStore"; // Import Store
import { cn } from "@/lib/utils";

export function DashboardLayout() {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50">
        <Sidebar />
      </div>

      <div 
        className={cn(
            "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
            isCollapsed ? "lg:pl-[70px]" : "lg:pl-64"
        )}
      >
        
        <div className="sticky top-0 z-40 lg:hidden flex items-center gap-2 bg-background border-b border-border h-16 px-4">
          <MobileSidebar />
          <span className="font-bold text-lg text-foreground">Codk</span>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block">
           <Header />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </main>
      </div>
    </div>
  );
}