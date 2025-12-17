import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CodkLogo } from "@/components/codk-logo";
import { useSidebarStore } from "@/stores/useSidebarStore";
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
  type LucideIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
interface SubItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
}

/**
 * 1. Simple Navigation Item Component
 */
const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label }) => {
  const { isCollapsed } = useSidebarStore();

  const content = (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          // ✅ FIX: Removed mb-1 and mx-auto (Parent controls spacing/alignment now)
          "flex items-center gap-3 rounded-md transition-all relative group h-10",

          // Collapsed vs Expanded Padding
          isCollapsed
            ? "justify-center px-0 w-10" // Just fixed width, alignment handled by parent
            : "px-3 w-full", 

          // Colors and Hover States
          isActive
            ? "text-sidebar-primary-foreground bg-sidebar-accent"
            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Active Indicator Strip (Only when expanded) */}
          {!isCollapsed && isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-r-full" />
          )}

          {/* Icon */}
          <Icon
            className={cn(
              "shrink-0 transition-colors",
              "h-5 w-5",
              isActive ? "text-sidebar-primary" : ""
            )}
          />

          {/* Label (Hidden when collapsed) */}
          {!isCollapsed && (
            <span className="whitespace-nowrap overflow-hidden text-sm font-medium animate-in fade-in duration-300">
              {label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-sidebar text-sidebar-foreground border-sidebar-border font-medium"
          >
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
};

/**
 * 2. Collapsible Navigation Component
 */
interface CollapsibleNavProps {
  icon: LucideIcon;
  label: string;
  items: SubItem[];
  activeRoutes: string[];
}

const CollapsibleNav: React.FC<CollapsibleNavProps> = ({
  icon: Icon,
  label,
  items,
  activeRoutes,
}) => {
  const { isCollapsed } = useSidebarStore();
  const location = useLocation();
  const isActiveGroup = activeRoutes.some((route) =>
    location.pathname.startsWith(route)
  );
  const [isOpen, setIsOpen] = useState(isActiveGroup);

  // --- STATE 1: Sidebar is Collapsed ---
  if (isCollapsed) {
    return (
      <DropdownMenu>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                {/* ✅ FIX: Removed mb-1 and mx-auto. Matches NavItem dimensions exactly. */}
                <button
                  className={cn(
                    "flex items-center justify-center gap-3 rounded-md transition-all relative group h-10 w-10",
                    isActiveGroup
                      ? "text-sidebar-primary-foreground bg-sidebar-accent"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isActiveGroup ? "text-sidebar-primary" : ""
                    )}
                  />
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-sidebar text-sidebar-foreground border-sidebar-border font-medium"
            >
              {label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuContent
          side="right"
          align="start"
          className="w-48 bg-sidebar border-sidebar-border ml-2 p-1 text-sidebar-foreground shadow-xl"
        >
          <DropdownMenuLabel className="px-2 py-1.5 text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            {label}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-sidebar-border/50" />

          {items.map((item) => (
            <DropdownMenuItem key={item.to} asChild className="p-0">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 w-full p-2 rounded-sm text-sm transition-colors cursor-pointer",
                    isActive
                      ? "text-sidebar-primary bg-sidebar-accent/50"
                      : "hover:bg-sidebar-accent/50"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // --- STATE 2: Sidebar is Expanded ---
  return (
    // ✅ FIX: Removed mb-1, letting parent space-y handle gap
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between gap-3 px-3 text-sm font-medium rounded-md transition-colors h-10",
          isActiveGroup
            ? "text-sidebar-foreground bg-sidebar-accent/50"
            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon
            className={cn(
              "h-5 w-5 shrink-0",
              isActiveGroup ? "text-sidebar-primary" : ""
            )}
          />
          <span>{label}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden space-y-1 pl-5">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors relative h-9",
                  isActive
                    ? "text-sidebar-foreground bg-sidebar-accent/30"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/20"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sidebar-primary rounded-r-full" />
                  )}
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * 3. Main Sidebar Component
 */
export function Sidebar() {
  const { isCollapsed } = useSidebarStore();

  const academicItems: SubItem[] = [
    { to: "/students", label: "Students", icon: Users },
    { to: "/tutors", label: "Tutors", icon: UserCheck },
    { to: "/sessions", label: "Sessions", icon: Calendar },
  ];

  return (
    <aside
      className={cn(
        "hidden lg:flex fixed left-0 top-0 bottom-0 bg-sidebar text-sidebar-foreground flex-col z-40 border-r border-sidebar-border shadow-xl transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
<div
        className={cn(
          "h-16 flex items-center border-b border-sidebar-border/50 transition-all",
          isCollapsed ? "justify-center" : "px-6"
        )}
      >
        <CodkLogo
          className={cn(
            "transition-all duration-300",
            isCollapsed ? "h-11 w-11" : "h-12 w-auto"
          )}
          variant="dark"
        />
      </div>

      {/* Navigation Links */}
      <nav 
        className={cn(
            "flex-1 p-3 overflow-y-auto custom-scrollbar overflow-x-hidden flex flex-col",
            isCollapsed ? "items-center space-y-3" : "space-y-1"
        )}
      >
        {!isCollapsed && (
          <div className="mb-2 px-2 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider animate-in fade-in">
            Overview
          </div>
        )}

        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavItem to="/crm" icon={Users} label="CRM" />

        {!isCollapsed && (
          <div className="mt-6 mb-2 px-2 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider animate-in fade-in">
            Management
          </div>
        )}

        <CollapsibleNav
          icon={GraduationCap}
          label="Academics"
          items={academicItems}
          activeRoutes={["/students", "/tutors", "/sessions"]}
        />

        <NavItem to="/finance" icon={Banknote} label="Finance" />
        <NavItem to="/reports" icon={BarChart3} label="Reports" />
      </nav>

      {/* Footer */}
      <div className={cn("p-3 border-t border-sidebar-border/50", isCollapsed && "flex justify-center")}>
        <NavItem to="/settings" icon={Settings} label="Settings" />
      </div>
    </aside>
  );
}