import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CodkLogo } from "@/components/codk-logo";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Banknote,
  BarChart3,
  Settings,
  ChevronDown,
  UserCheck,
  Calendar,
  Menu,
} from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md transition-colors relative group",
        isActive
          ? "text-sidebar-primary-foreground bg-sidebar-accent"
          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-r-full" />
      )}
      <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-sidebar-primary" : "")} />
      <span>{label}</span>
    </Link>
  );
};

interface CollapsibleNavProps {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleNav: React.FC<CollapsibleNavProps> = ({
  icon: Icon,
  label,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-3 py-3 text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 shrink-0" />
          <span>{label}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="ml-4 pl-2 border-l border-sidebar-border/50 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isAcademicsActive = ["/students", "/tutors", "/sessions"].some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground hover:text-foreground">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="left" 
        className="w-72 p-0 bg-sidebar border-sidebar-border text-sidebar-foreground border-r"
      >
        {/* Accessibility Title (Required by Radix UI) */}
        <VisuallyHidden.Root>
          <SheetTitle>Navigation Menu</SheetTitle>
        </VisuallyHidden.Root>

        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border/50">
           <CodkLogo className="h-8 w-auto" variant="dark" />
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)] custom-scrollbar">
            <div className="mb-4 px-2 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider">
              Overview
            </div>
            
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => setOpen(false)} />
            <NavItem to="/crm" icon={Users} label="CRM" onClick={() => setOpen(false)} />

            <div className="mt-6 mb-2 px-2 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider">
              Management
            </div>

            <CollapsibleNav
              icon={GraduationCap}
              label="Academics"
              defaultOpen={isAcademicsActive}
            >
              <NavItem to="/students" icon={Users} label="Students" onClick={() => setOpen(false)} />
              <NavItem to="/tutors" icon={UserCheck} label="Tutors" onClick={() => setOpen(false)} />
              <NavItem to="/sessions" icon={Calendar} label="Sessions" onClick={() => setOpen(false)} />
            </CollapsibleNav>

            <NavItem to="/finance" icon={Banknote} label="Finance" onClick={() => setOpen(false)} />
            <NavItem to="/reports" icon={BarChart3} label="Reports" onClick={() => setOpen(false)} />

            {/* Footer / Settings */}
            <div className="pt-4 mt-4 border-t border-sidebar-border/50">
               <NavItem to="/settings" icon={Settings} label="Settings" onClick={() => setOpen(false)} />
            </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}