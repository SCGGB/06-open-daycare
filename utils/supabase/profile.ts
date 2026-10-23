import { createClient } from "@/utils/supabase/server";
import { requireUser } from "@/utils/supabase/auth";

export type CurrentUserProfile = {
  fullName: string;
  role: string;
  daycareName: string | null;
};

export async function getCurrentUserProfile(): Promise<CurrentUserProfile | null> {
  const user = await requireUser();
  const supabase = await createClient();

  const { data } = await supabase
    .from("users")
    .select("full_name, role, daycares(name)")
    .eq("id", user.id)
    .maybeSingle();

  if (!data) {
    return null;
  }

  const daycareName =
    (data as unknown as { daycares?: { name: string } | null }).daycares?.name ??
    null;

  return {
    fullName: data.full_name,
    role: data.role,
    daycareName,
  };
}
