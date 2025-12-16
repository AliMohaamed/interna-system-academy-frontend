import React from "react";
import { CodkLogo } from "@/components/codk-logo";
import { GeometricBackground } from "../components/geometric-background";
import { LoginForm } from "../components/LoginForm"; // ✅ Ensure this matches the file name exactly
import { Code2, Users, Trophy, Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <GeometricBackground />
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full">
          <div><CodkLogo className="h-10 w-auto" variant="light" /></div>

          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Empowering the Next Generation of <span className="text-teal-400">Coders</span>
            </h1>
            
            <div className="grid grid-cols-2 gap-4">
              <FeatureCard icon={<Users />} title="Student Management" description="Track progress" />
              <FeatureCard icon={<Code2 />} title="Course Builder" description="Create curriculum" />
              <FeatureCard icon={<Trophy />} title="Achievements" description="Gamified learning" />
              <FeatureCard icon={<Sparkles />} title="AI Assistant" description="Smart insights" />
            </div>
          </div>
          
          <p className="text-white/40 italic">"The best way to predict the future is to create it."</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left space-y-2">
               <h2 className="text-3xl font-bold tracking-tight">Welcome Back!</h2>
               <p className="text-muted-foreground">Please sign in to access the dashboard.</p>
            </div>
            <LoginForm />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
      <div className="flex items-start gap-3">
        <div className="text-teal-400">{icon}</div>
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-xs text-white/60">{description}</p>
        </div>
      </div>
    </div>
  );
}