import { requireUser } from "@/utils/supabase/auth";
import { KidsPageClient } from "./KidsPageClient";

export default async function KidsPage() {
  await requireUser();

  return <KidsPageClient />;
}
