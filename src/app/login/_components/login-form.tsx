"use client";

import { useActionState } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import { sendMagicLinkAction, signInWithPasswordAction, type LoginActionState } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const initialState: LoginActionState = {
  status: "idle",
  message: "",
};

export function LoginForm({ next = "/admin" }: { next?: string }) {
  const [passwordState, passwordAction, isPasswordPending] = useActionState(signInWithPasswordAction, initialState);
  const [magicState, magicAction, isMagicPending] = useActionState(sendMagicLinkAction, initialState);
  const activeState = passwordState.status !== "idle" ? passwordState : magicState;

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
        <form action={magicAction} className="grid gap-4 border-t pt-4">
          <input type="hidden" name="next" value={next} />
          <label className="grid gap-2 text-sm font-semibold">
            Email for magic link
            <Input name="email" type="email" placeholder="admin@example.com" autoComplete="email" required />
          </label>
          <Button variant="outline" disabled={isMagicPending}>
            <Mail className="size-4" />
            {isMagicPending ? "Sending..." : "Send magic link"}
          </Button>
        </form>
        {activeState.status !== "idle" ? (
          <p className={activeState.status === "success" ? "rounded-md border bg-secondary p-3 text-sm" : "rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"}>
            {activeState.message}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
