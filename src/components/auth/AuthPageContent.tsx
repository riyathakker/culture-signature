"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User, Mail, Lock, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/context/TranslationContext";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "../layout/navbar/Logo";

type AuthView = "login" | "signup" | "forgot-password";

interface AuthPageContentProps {
  initialView?: AuthView;
  callbackUrl?: string;
}

export function AuthPageContent({ initialView = "login", callbackUrl = "/" }: AuthPageContentProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [view, setView] = useState<AuthView>(initialView);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (view === "login") {
        const result = await signIn("credentials", { email, password, redirect: false });
        if (result?.error) {
          toast.error(t("auth.login.error"));
        } else {
          toast.success(t("auth.login.success"));
          router.push(callbackUrl);
        }
      } else if (view === "signup") {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || t("auth.signup.error"));
        toast.success(t("auth.signup.success"));
        const loginResult = await signIn("credentials", { email, password, redirect: false });
        if (loginResult?.error) {
          toast.error(t("auth.signup.autoLoginError"));
          setView("login");
        } else {
          router.push(callbackUrl);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh [@media(display-mode:standalone)]:h-[calc(100dvh-4rem-env(safe-area-inset-bottom))] [@media(display-mode:standalone)]:min-h-0 [@media(display-mode:standalone)]:overflow-hidden">
      {/* ── Left editorial panel (desktop only) ── */}
      <div className="hidden md:flex md:w-1/2 lg:w-[55%] relative flex-col bg-gradient-to-br from-[#160806] via-primary to-[#c4705a]">
        {/* top logo */}
        <div className="relative z-10 p-10">
          <Link href="/">
            <Image src="/Logo_new.png" alt="Culture Signature" width={60} height={60} className="brightness-0 invert" />
          </Link>
        </div>

        {/* bottom editorial copy */}
        <div className="relative z-10 mt-auto p-10 pb-14 space-y-4">
          <div className="w-8 h-px bg-white/40" />
          <p className="font-heading italic text-white/90 text-3xl lg:text-4xl leading-snug">
            {view === "signup"
              ? "Begin your journey\ninto timeless elegance."
              : "Welcome back to\nthe world of fine luxury."}
          </p>
          <p className="text-white/50 text-sm tracking-widest uppercase font-sans">
            Culture Signature by Jalpa Thakkar
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col bg-background relative overflow-y-auto">

        {/* Mobile: branded header */}
        <div className="md:hidden relative h-36 overflow-hidden shrink-0 bg-gradient-to-br from-[#160806] via-primary to-[#c4705a]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/70" />
          <div className="absolute inset-0 flex flex-col justify-between p-6 pb-0">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-white/80 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Image src="/Logo_new.png" alt="Culture Signature" width={80} height={80} className="brightness-0 invert" />
              <div className="w-5" />
            </div>
          </div>
        </div>

        {/* Desktop: back link */}
        <div className="hidden md:flex items-center justify-between px-10 pt-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 md:px-14">
          <div className="w-full max-w-sm space-y-8">

            {/* Heading */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">
                {view === "login" && "Welcome back"}
                {view === "signup" && "New member"}
                {view === "forgot-password" && "Account recovery"}
              </p>
              <h2 className="font-heading text-3xl text-foreground leading-tight">
                {view === "login" && t("auth.login.title")}
                {view === "signup" && t("auth.signup.title")}
                {view === "forgot-password" && t("auth.forgotPassword.title")}
              </h2>
              <p className="text-sm text-muted-foreground font-serif italic">
                {view === "login" && t("auth.login.description")}
                {view === "signup" && t("auth.signup.description")}
                {view === "forgot-password" && t("auth.forgotPassword.description")}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {view === "signup" && (
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="label-luxury">
                    {t("auth.signup.fullName")}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
                    <Input
                      id="name"
                      placeholder={t("auth.signup.fullNamePlaceholder")}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="pl-11 input-luxury"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="label-luxury">
                  {t("auth.common.email")}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("auth.common.emailPlaceholder")}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 input-luxury w-full"
                  />
                </div>
              </div>

              {view !== "forgot-password" && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="label-luxury">
                      {t("auth.common.password")}
                    </Label>
                    {view === "login" && (
                      <button
                        type="button"
                        onClick={() => setView("forgot-password")}
                        className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors"
                      >
                        {t("auth.login.forgotPassword")}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full btn-luxury mt-2"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    <span>{t("auth.common.processing")}</span>
                  </div>
                ) : (
                  <>
                    {view === "login" && t("auth.login.submit")}
                    {view === "signup" && t("auth.signup.submit")}
                    {view === "forgot-password" && t("auth.forgotPassword.submit")}
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-bold">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Toggle login / signup */}
            <div className="text-center">
              {view === "login" ? (
                <p className="text-sm text-muted-foreground font-serif italic">
                  {t("auth.login.newToBrand")}{" "}
                  <button
                    onClick={() => setView("signup")}
                    className="not-italic font-sans font-bold text-primary hover:underline underline-offset-4"
                  >
                    {t("auth.login.createAccount")}
                  </button>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground font-serif italic">
                  Already have an account?{" "}
                  <button
                    onClick={() => setView("login")}
                    className="not-italic font-sans font-bold text-primary hover:underline underline-offset-4"
                  >
                    {t("auth.forgotPassword.backToLogin")}
                  </button>
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
