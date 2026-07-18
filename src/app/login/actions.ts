"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { absoluteUrl } from "@/lib/utils";

export type LoginActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getRedirectPath(formData: FormData) {
  const next = getString(formData, "next");
  return next.startsWith("/admin") ? next : "/admin";
}

export async function signInWithPasswordAction(_: LoginActionState, formData: FormData): Promise<LoginActionState> {
  const email = getString(formData, "email");
  const password = getString(formData, "password");

  if (!email || !password) {
    return { status: "error", message: "Email and password are required." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { status: "error", message: error.message };
    }
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unable to sign in.",
    };
  }

  redirect(getRedirectPath(formData));
}

export async function sendMagicLinkAction(_: LoginActionState, formData: FormData): Promise<LoginActionState> {
  const email = getString(formData, "email");

  if (!email) {
    return { status: "error", message: "Email is required." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: absoluteUrl(getRedirectPath(formData)),
      },
    });

    if (error) {
      return { status: "error", message: error.message };
    }
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unable to send magic link.",
    };
  }

  return { status: "success", message: "Magic link sent. Please check your email." };
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
