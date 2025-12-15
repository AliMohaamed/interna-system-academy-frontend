import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";

import apiClient from "@/lib/axios";
import { useAuthStore } from "../stores/useAuthStore";
import { type LoginFormData, loginSchema } from "./login-schema";
import type { ApiResponse, LoginResponseData, ApiErrorResponse } from "../types";

// UI Components (Shadcn)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

export function LoginForm() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 1. Initialize Form with Strict Typing
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Submit Handler
  async function onSubmit(values: LoginFormData) {
    setIsLoading(true);
    try {
      // API Call with Generic Type for Response <ApiResponse<LoginResponseData>>
      const response = await apiClient.post<ApiResponse<LoginResponseData>>(
        "/auth/login",
        values
      );

      // Extract Data safely
      const { user, accessToken } = response.data.data;

      // Update Store
      setAuth(user, accessToken);

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });

      // Redirect to Dashboard
      navigate("/dashboard");
    } catch (error: unknown) {
      // 🔥 Handling Error Strictly (No 'any')
      const err = error as AxiosError<ApiErrorResponse>;

      let errorMessage = "Something went wrong. Please try again.";

      if (err.response && err.response.data) {
        // Backend specific error message [cite: 370]
        errorMessage = err.response.data.message;
      } else if (err.message) {
        // Network or Client error
        errorMessage = err.message;
      }

      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Codk System
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin@codk.com"
                        type="email"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="******"
                        type="password"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}