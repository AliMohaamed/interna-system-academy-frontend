import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CodkLogo } from "@/components/codk-logo"; // ✅ Correct Import
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
} from "lucide-react";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-all relative group",
          isActive
            ? "text-sidebar-primary-foreground bg-sidebar-accent"
            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-r-full" />
          )}
          <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-sidebar-primary" : "")} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
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
        className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-4 w-4 shrink-0" />
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
        <div className="ml-4 pl-2 border-l border-sidebar-border space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

export function Sidebar() {
  const location = useLocation();
  const academicsRoutes = ["/students", "/tutors", "/sessions"];
  const isAcademicsActive = academicsRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar text-sidebar-foreground flex flex-col z-40 border-r border-sidebar-border shadow-xl">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <CodkLogo className="h-8 w-auto" variant="dark" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="mb-4 px-2 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider">
          Overview
        </div>
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavItem to="/crm" icon={Users} label="CRM" />

        <div className="mt-6 mb-2 px-2 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider">
          Management
        </div>
        
        <CollapsibleNav
          icon={GraduationCap}
          label="Academics"
          defaultOpen={isAcademicsActive}
        >
          <NavItem to="/students" icon={Users} label="Students" />
          <NavItem to="/tutors" icon={UserCheck} label="Tutors" />
          <NavItem to="/sessions" icon={Calendar} label="Sessions" />
        </CollapsibleNav>

        <NavItem to="/finance" icon={Banknote} label="Finance" />
        <NavItem to="/reports" icon={BarChart3} label="Reports" />
      </nav>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-sidebar-border/50">
        <NavItem to="/settings" icon={Settings} label="Settings" />
      </div>
    </aside>
  );
}