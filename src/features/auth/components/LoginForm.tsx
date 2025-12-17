import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";

import apiClient from "@/lib/axios";
import { useAuthStore } from "../stores/useAuthStore";
import { type LoginFormData, loginSchema } from "./login-schema";
import type {
  ApiResponse,
  LoginResponseData,
  ApiErrorResponse,
} from "../types";

// UI Components
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AuthInput } from "./AuthInput";

export function LoginForm() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // 1. Initialize Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Submit Handler (Real API Logic)
  async function onSubmit(values: LoginFormData) {
    setIsLoading(true);
    try {
      // API Call
      const response = await apiClient.post<ApiResponse<LoginResponseData>>(
        "/auth/login",
        values
      );

      // Update Store
      const { user, accessToken } = response.data.data;
      setAuth(user, accessToken);

      toast.success("Welcome back! You have successfully logged in.");

      // Redirect
      navigate("/dashboard");
    } catch (error: unknown) {
      const err = error as AxiosError<ApiErrorResponse>;
      let errorMessage = "Something went wrong. Please try again.";

      if (err.response && err.response.data) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* Email Input - Reusable & Clean */}
      <AuthInput
        id="email"
        label="Email Address"
        type="email"
        placeholder="example@example.com"
        icon={<Mail />}
        registration={register("email")}
        error={errors.email}
        disabled={isLoading}
      />

      {/* Password Input - Reusable & Clean */}
      <AuthInput
        id="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="******"
        icon={<Lock />}
        registration={register("password")}
        error={errors.password}
        disabled={isLoading}
        endIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="flex items-center justify-center p-1 focus:outline-none"
            tabIndex={-1} // Prevent tabbing to this specific button
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            )}
          </button>
        }
      />

      <div className="flex justify-end">
        <button
          type="button"
          className="text-sm font-medium text-primary hover:underline focus:outline-none"
          onClick={() => toast.info("Forgot Password feature coming soon!")}
        >
          Forgot Password?
        </button>
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-70"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      {/* Demo Hint (Optional - You can remove this for production) */}
      <div className="rounded-lg bg-muted/50 p-3 border border-border text-center">
        <p className="text-xs text-muted-foreground">Secure Login System</p>
      </div>
    </form>
  );
}
