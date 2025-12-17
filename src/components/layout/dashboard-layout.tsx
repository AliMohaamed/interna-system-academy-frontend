import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileSidebar } from "./mobile-sidebar";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-muted/20">
      {/* Desktop Sidebar (Fixed) */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64">
        <Sidebar />
      </div>

      {/* Main Content Wrapper */}
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
        
        {/* Mobile Header Trigger */}
        <div className="sticky top-0 z-40 lg:hidden flex items-center gap-2 bg-background border-b border-border h-16 px-4">
          <MobileSidebar />
          <span className="font-bold text-lg text-foreground">Codk Panel</span>
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