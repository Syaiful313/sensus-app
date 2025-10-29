"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <Button
      onClick={handleLogout}
      className="w-full bg-sky-600 font-semibold transition hover:bg-sky-700 sm:w-auto"
    >
      Logout
    </Button>
  );
}
