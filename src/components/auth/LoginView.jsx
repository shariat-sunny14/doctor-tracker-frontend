"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { LogoMark } from "@/components/ui/Logo";
import api from "@/lib/api";
import { DEMO_CREDENTIALS } from "@/lib/constants";
import { errorMessage } from "@/lib/utils";
import { loginSchema } from "@/lib/schemas";

/** Only allow redirects back into this app (blocks open-redirect via ?next=https://evil.com). */
const safeNext = (value) =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";

function HeartbeatArt() {
  return (
    <svg viewBox="0 0 640 200" className="w-full" fill="none" aria-hidden>
      <path
        d="M0 110H150l20-52 28 112 26-82 14 22H330l20-52 28 112 26-82 14 22H640"
        stroke="#7cc9b9"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
        strokeDasharray="1"
        className="animate-draw"
      />
    </svg>
  );
}

export default function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [slow, setSlow] = useState(false);
  const hasDemo = DEMO_CREDENTIALS.email && DEMO_CREDENTIALS.password;

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  // Free hosting puts the API to sleep when idle. Waking it up now (while the person is typing) hides the delay.
  useEffect(() => {
    api.get("/health").catch(() => {});
  }, []);

  useEffect(() => {
    if (searchParams.get("expired")) toast.info("Your session expired. Please sign in again.");
  }, [searchParams]);

  async function onSubmit(values) {
    setSlow(false);
    const timer = setTimeout(() => setSlow(true), 4000);
    try {
      await api.post("/auth/login", values);
      router.replace(safeNext(searchParams.get("next")));
    } catch (error) {
      const message = errorMessage(error, "Sign in failed. Please try again.");
      if (error.response?.status === 401) setError("password", { message });
      else toast.error(message);
    } finally {
      clearTimeout(timer);
      setSlow(false);
    }
  }

  function fillDemo() {
    setValue("email", DEMO_CREDENTIALS.email, { shouldValidate: true });
    setValue("password", DEMO_CREDENTIALS.password, { shouldValidate: true });
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-brand-950 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <LogoMark className="size-10" />
          <span className="font-display text-xl font-semibold tracking-tight">Doctor Tracker</span>
        </div>

        <div>
          <h1 className="max-w-md font-display text-5xl font-semibold leading-[1.05] tracking-tight">
            Every doctor and every patient, in one clear view.
          </h1>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-brand-100/75">
            Add doctors, keep patient records current and see how your care teams are growing, all from a
            single admin portal.
          </p>
        </div>

        <div className="-mx-12 opacity-90">
          <HeartbeatArt />
        </div>
      </section>

      {/* Form */}
      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <LogoMark className="size-10" />
            <span className="font-display text-xl font-semibold tracking-tight">Doctor Tracker</span>
          </div>

          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900">Sign in</h2>
          <p className="mt-2 text-sm text-ink-600">Use your administrator account to continue.</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
            <Field label="Email" htmlFor="email" error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="you@hospital.com"
                invalid={!!errors.email}
                {...register("email")}
              />
            </Field>

            <Field label="Password" htmlFor="password" error={errors.password?.message}>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  invalid={!!errors.password}
                  className="pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </Field>

            <Button type="submit" loading={isSubmitting} className="h-11 w-full">
              {isSubmitting ? "Signing in" : "Sign in"}
            </Button>

            {slow && (
              <p
                role="status"
                className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-inset ring-amber-200"
              >
                The server is waking up after a period of inactivity. This can take up to a minute the first
                time.
              </p>
            )}
          </form>

          {hasDemo && (
            <div className="mt-8 rounded-xl border border-dashed border-brand-300 bg-brand-50/60 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand-700" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink-900">Demo access</p>
                  <p className="mt-0.5 text-xs text-ink-600">Look around with ready-made sample data.</p>
                  <dl className="mt-3 space-y-1 text-xs text-ink-700">
                    <div className="flex gap-2">
                      <dt className="w-16 shrink-0 text-ink-500">Email</dt>
                      <dd className="truncate font-medium">{DEMO_CREDENTIALS.email}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-16 shrink-0 text-ink-500">Password</dt>
                      <dd className="truncate font-medium">{DEMO_CREDENTIALS.password}</dd>
                    </div>
                  </dl>
                  <Button type="button" variant="secondary" size="sm" onClick={fillDemo} className="mt-3">
                    <KeyRound className="size-3.5" aria-hidden />
                    Fill demo credentials
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
