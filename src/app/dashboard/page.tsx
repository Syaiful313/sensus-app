import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LogoutButton from "@/components/logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Selamat datang kembali!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Email:</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">User ID:</p>
            <p className="font-mono text-sm">{user.id}</p>
          </div>
          <LogoutButton />
        </CardContent>
      </Card>
    </div>
  );
}
