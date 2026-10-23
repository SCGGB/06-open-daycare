import { KidsPageClient } from "./KidsPageClient";
import { getCurrentUserProfile } from "@/utils/supabase/profile";

export default async function KidsPage() {
  const profile = await getCurrentUserProfile();

  return <KidsPageClient profile={profile} />;
}
