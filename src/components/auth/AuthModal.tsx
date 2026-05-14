"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, User, ArrowRight, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AuthView = "login" | "signup" | "forgot-password";

import { en } from "@/locales/en";

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [view, setView] = useState<AuthView>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (view === "login") {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          toast.error(en.auth.login.error);
        } else {
          toast.success(en.auth.login.success);
          onOpenChange(false);
          router.refresh();
        }
      } else if (view === "signup") {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || en.auth.signup.error);
        }

        toast.success(en.auth.signup.success);

        // Auto-login after signup
        const loginResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (loginResult?.error) {
          toast.error(en.auth.signup.autoLoginError);
          setView("login");
        } else {
          onOpenChange(false);
          router.refresh();
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 border-none bg-background rounded-2xl shadow-2xl [&>button]:text-white [&>button]:opacity-100">
        {/* Banner */}
        <div className="relative h-18 bg-primary flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-luxury-gradient opacity-20" />
          <h2 className="text-primary-foreground font-heading text-xl tracking-widest uppercase relative z-10">
            Culture Signature
          </h2>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold tracking-tight text-foreground">
              {view === "login" && en.auth.login.title}
              {view === "signup" && en.auth.signup.title}
              {view === "forgot-password" && en.auth.forgotPassword.title}
            </h3>
            <p className="text-sm text-muted-foreground font-serif italic">
              {view === "login" && en.auth.login.description}
              {view === "signup" && en.auth.signup.description}
              {view === "forgot-password" && en.auth.forgotPassword.description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {view === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {en.auth.signup.fullName} {view === "signup" && <span className="text-primary">*</span>}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder={en.auth.signup.fullNamePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={view === "signup"}
                    className="pl-10 input-luxury"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {en.auth.common.email} <span className="text-primary">*</span>
                </Label>
                {view === "login" && (
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" className="rounded-sm border-muted-foreground/30" />
                    <Label htmlFor="remember" className="text-xs font-medium text-muted-foreground cursor-pointer">{en.auth.login.remember}</Label>
                  </div>
                )}
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={en.auth.common.emailPlaceholder}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 input-luxury w-full"
                />
              </div>
            </div>

            {view !== "forgot-password" && (
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {en.auth.common.password} <span className="text-primary">*</span>
                  </Label>
                  {view === "login" && (
                    <button
                      type="button"
                      onClick={() => setView("forgot-password")}
                      className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                    >
                      {en.auth.login.forgotPassword}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-12 input-luxury w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-luxury"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>{en.auth.common.processing}</span>
                </div>
              ) : (
                <>
                  {view === "login" && en.auth.login.submit}
                  {view === "signup" && en.auth.signup.submit}
                  {view === "forgot-password" && en.auth.forgotPassword.submit}
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            {view === "login" ? (
              <p className="text-sm text-muted-foreground font-serif italic">
                {en.auth.login.newToBrand}{"  "}
                <button
                  onClick={() => setView("signup")}
                  className="text-primary font-sans font-bold not-italic hover:underline"
                >
                  {en.auth.login.createAccount}
                </button>
              </p>
            ) : (
              <button
                onClick={() => setView("login")}
                className="text-sm text-primary font-bold hover:underline"
              >
                {en.auth.forgotPassword.backToLogin}
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
