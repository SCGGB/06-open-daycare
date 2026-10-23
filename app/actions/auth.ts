"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

type LoginState = { error: string | null };

function getFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getSafeNext(value: string): string {
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/";
  }

  if (value === "/login" || value.startsWith("/login?")) {
    return "/";
  }

  return value;
}

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = getFormString(formData, "email").trim();
  const password = getFormString(formData, "password");
  const next = getSafeNext(getFormString(formData, "next"));

  if (!email || !password) {
    return { error: "Email o contraseña incorrectos." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: "Email o contraseña incorrectos." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, status")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError || !profile || profile.status !== "active") {
    await supabase.auth.signOut();
    return { error: "Tu cuenta está pendiente de activación." };
  }

  redirect(next);
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
