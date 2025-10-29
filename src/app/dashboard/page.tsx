import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LogoutButton from "@/components/logout-button";
import AnggotaTable from "@/components/anggota/anggota-table";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: anggota, error } = await supabase
    .from("anggota")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
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

        <Card>
          <CardHeader>
            <CardTitle>Data Anggota</CardTitle>
            <CardDescription>Kelola data anggota organisasi</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-sm text-red-600">
                Gagal memuat data anggota. Silakan coba lagi.
              </p>
            ) : (
              <AnggotaTable initialData={anggota || []} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
