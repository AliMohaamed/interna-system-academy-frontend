import React from "react";
import { Input } from "@/components/ui/input"; // Make sure aliases are set in vite.config, or use relative paths
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  endIcon?: React.ReactNode;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  icon,
  registration,
  error,
  className,
  endIcon,
  id,
  ...props
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
          {icon}
        </div>
        
        <Input
          id={id}
          aria-invalid={!!error}
          className={cn(
            "pl-10 h-12 bg-muted/50 border-border focus:bg-background transition-colors",
            endIcon ? "pr-12" : "",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...registration}
          {...props}
        />
        
        {endIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            {endIcon}
          </div>
        )}
      </div>
      
      {/* Height placeholder to prevent layout shift */}
      <div className="min-h-[20px]">
        {error && (
          <p className="text-sm text-destructive animate-in fade-in slide-in-from-top-1">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
};