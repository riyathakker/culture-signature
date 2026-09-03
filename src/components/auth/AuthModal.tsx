"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type AuthView = "login" | "signup" | "forgot-password";

import { useTranslation } from "@/context/TranslationContext";
import { useCountdown } from "@/hooks/useCountdown";
import { RESEND_COOLDOWN } from "./AuthPageContent";
import { PasswordStrength } from "./PasswordStrength";

export function AuthModal({ open: openProp, onOpenChange: onOpenChangeProp }: AuthModalProps) {
  const { t } = useTranslation();
  const { isModalOpen, callbackUrl, closeModal } = useAuthStore();
  const open = openProp ?? isModalOpen;
  const onOpenChange = onOpenChangeProp ?? ((val: boolean) => { if (!val) closeModal(); });
  const [view, setView] = useState<AuthView>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // On mobile, redirect to the login page instead of showing the modal
  useEffect(() => {
    if (open && window.innerWidth < 768) {
      onOpenChange(false);
      const query = callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : "";
      router.push(`/login${query}`);
    }
  }, [open]);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const { seconds: resendIn, start: startResend } = useCountdown();

  // Reset the OTP step whenever the user leaves signup or edits their email.
  useEffect(() => { setOtpSent(false); setCode(""); }, [view]);
  useEffect(() => { if (otpSent) { setOtpSent(false); setCode(""); } }, [email]);

  const handleResendCode = async () => {
    if (resendIn > 0) return;
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("auth.signup.error"));
      startResend(RESEND_COOLDOWN);
      toast.success(t("auth.signup.codeSent"));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

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
          toast.error(t("auth.login.error"));
        } else {
          toast.success(t("auth.login.success"));
          onOpenChange(false);
          const session = await getSession();
          const role = (session?.user as any)?.role;
          if (role === "ADMIN") {
            window.location.href = "/admin";
          } else if (callbackUrl) {
            router.push(callbackUrl);
          } else {
            router.refresh();
          }
        }
      } else if (view === "signup") {
        // Step 1 — request the emailed verification code.
        if (!otpSent) {
          if (!name.trim() || !email.trim() || password.length < 8) {
            toast.error(t("auth.signup.validation"));
            return;
          }
          const otpRes = await fetch("/api/auth/otp/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          const otpData = await otpRes.json();
          if (!otpRes.ok) throw new Error(otpData.error || t("auth.signup.error"));
          setOtpSent(true);
          startResend(RESEND_COOLDOWN);
          toast.success(t("auth.signup.codeSent"));
          return;
        }

        // Step 2 — create the account with the code.
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, code }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || t("auth.signup.error"));
        }

        toast.success(t("auth.signup.success"));

        // Auto-login after signup
        const loginResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (loginResult?.error) {
          toast.error(t("auth.signup.autoLoginError"));
          setView("login");
        } else {
          onOpenChange(false);
          if (callbackUrl) {
            router.push(callbackUrl);
          } else {
            router.refresh();
          }
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
      <DialogContent className="sm:max-w-[450px] p-0 border-none bg-background rounded-2xl overflow-y-auto max-h-[90dvh] shadow-2xl [&>button]:text-white [&>button]:opacity-100">
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
              {view === "login" && t("auth.login.title")}
              {view === "signup" && t("auth.signup.title")}
              {view === "forgot-password" && t("auth.forgotPassword.title")}
            </h3>
            <p className="text-sm muted-italic">
              {view === "login" && t("auth.login.description")}
              {view === "signup" && t("auth.signup.description")}
              {view === "forgot-password" && t("auth.forgotPassword.description")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {view === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {t("auth.signup.fullName")} {view === "signup" && <span className="text-primary">*</span>}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder={t("auth.signup.fullNamePlaceholder")}
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
                  {t("auth.common.email")} <span className="text-primary">*</span>
                </Label>
                {view === "login" && (
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" className="rounded-sm border-muted-foreground/30" />
                    <Label htmlFor="remember" className="text-xs font-medium text-muted-foreground cursor-pointer">{t("auth.login.remember")}</Label>
                  </div>
                )}
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {t("auth.common.password")} <span className="text-primary">*</span>
                  </Label>
                  {view === "login" && (
                    <button
                      type="button"
                      onClick={() => setView("forgot-password")}
                      className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                    >
                      {t("auth.login.forgotPassword")}
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
                    maxLength={view === "signup" ? 15 : undefined}
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
                {view === "signup" && password.length > 0 && <PasswordStrength password={password} />}
              </div>
            )}

            {view === "signup" && otpSent && (
              <div className="space-y-2">
                <Label htmlFor="code" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {t("auth.signup.codeLabel")} <span className="text-primary">*</span>
                </Label>
                <Input
                  id="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="••••••"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="input-luxury w-full tracking-[0.5em] text-center"
                />
                <div className="flex items-center justify-between text-xs">
                  <span className="muted-italic truncate">{t("auth.signup.codeHint")}</span>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendIn > 0}
                    className="font-bold text-primary hover:opacity-70 disabled:text-muted-foreground disabled:opacity-100 disabled:cursor-default whitespace-nowrap ml-2"
                  >
                    {resendIn > 0 ? t("auth.signup.resendIn", { seconds: resendIn.toString() }) : t("auth.signup.resend")}
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
                  <span>{t("auth.common.processing")}</span>
                </div>
              ) : (
                <>
                  {view === "login" && t("auth.login.submit")}
                  {view === "signup" && (otpSent ? t("auth.signup.submit") : t("auth.signup.sendCode"))}
                  {view === "forgot-password" && t("auth.forgotPassword.submit")}
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            {view === "login" ? (
              <p className="text-sm muted-italic">
                {t("auth.login.newToBrand")}{"      "}
                <button
                  type="button"
                  onClick={() => setView("signup")}
                  className="text-primary font-sans font-bold not-italic hover:underline"
                >
                  {t("auth.login.createAccount")}
                </button>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-sm text-primary font-bold hover:underline"
              >
                {t("auth.forgotPassword.backToLogin")}
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
