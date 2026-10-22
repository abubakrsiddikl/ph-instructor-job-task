"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { ArrowRight, UserRoundPlus } from "lucide-react";

import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/services/auth/auth.api";
import { toast } from "sonner";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, null);
  useEffect(() => {
    if (state && !state.success && state?.message) {
      toast.error(state?.message);
    }
    if (state && state?.success) {
      toast.success("Registration successful! Please login.");
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
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Karim Ahmed"
            required
          />
          <InputFieldError field="name" state={state} />
        </Field>
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
            autoComplete="new-password"
            placeholder="At least 4 characters"
            minLength={4}
            required
          />
          <FieldDescription>Use at least 4 characters.</FieldDescription>
          <InputFieldError field="password" state={state} />
        </Field>
      </FieldGroup>
      <Button
        type="submit"
        size="lg"
        className="h-11 w-full gap-2"
        disabled={isPending}
      >
        <UserRoundPlus aria-hidden="true" />
        {isPending ? "Creating your account..." : "Create account"}
        {!isPending && <ArrowRight aria-hidden="true" />}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-foreground underline underline-offset-4"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
