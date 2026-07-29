"use client";

import { useActionState } from "react";
import { LockKeyhole } from "lucide-react";
import { signInWithPasswordAction, type LoginActionState } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const initialState: LoginActionState = {
  status: "idle",
  message: "",
};

export function LoginForm({ next = "/admin" }: { next?: string }) {
  const [passwordState, passwordAction, isPasswordPending] = useActionState(signInWithPasswordAction, initialState);

  return (
    <Card className="w-full max-w-md">
      <CardContent className="grid gap-4 pt-5">
        <form action={passwordAction} className="grid gap-4">
          <input type="hidden" name="next" value={next} />
          <label className="grid gap-2 text-sm font-semibold">
            Email
            <Input name="email" type="email" placeholder="admin@example.com" autoComplete="email" required />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Password
            <Input name="password" type="password" placeholder="••••••••" autoComplete="current-password" required />
          </label>
          <Button disabled={isPasswordPending}>
            <LockKeyhole className="size-4" />
            {isPasswordPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        {passwordState.status !== "idle" ? (
          <p className={passwordState.status === "success" ? "rounded-md border bg-secondary p-3 text-sm" : "rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"}>
            {passwordState.message}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
