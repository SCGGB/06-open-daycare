import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function requireUser(): Promise<{
  id: string;
  email?: string;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data || !data.claims.sub) {
    redirect("/login");
  }

  return {
    id: data.claims.sub,
    email: data.claims.email,
  };
}
