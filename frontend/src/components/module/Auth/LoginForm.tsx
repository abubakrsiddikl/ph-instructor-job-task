"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { ArrowRight, LogIn } from "lucide-react";

import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/services/auth/auth.api";

import { toast } from "sonner";

// const initialState: AuthActionState = { success: false, message: "", errors: [] };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginUser, null);
  useEffect(() => {
    if (state && !state.success && state?.message) {
      toast.error(state?.message);
    }
    if (state && state?.success) {
      toast.success("Login successful! Welcome back.");
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      {/* {state?.message && (
        <p
          role="status"
          className={`rounded-md border px-4 py-3 text-sm ${state?.success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}
        >
          {state?.message}
        </p>
      )} */}
      <FieldGroup className="gap-4">
        <Field>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
          <InputFieldError field="email" state={state} />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            minLength={4}
            required
          />
          <InputFieldError field="password" state={state} />
        </Field>
      </FieldGroup>
      <Button
        type="submit"
        size="lg"
        className="h-11 w-full gap-2"
        disabled={isPending}
      >
        <LogIn aria-hidden="true" />
        {isPending ? "Signing you in..." : "Log in"}
        {!isPending && <ArrowRight aria-hidden="true" />}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        New to Projectfolio?{" "}
        <Link
          href="/register"
          className="font-semibold text-foreground underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
