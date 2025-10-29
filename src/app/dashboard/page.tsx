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
import Link from "next/link";

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
        <nav className="flex flex-col gap-4 rounded-md border bg-background px-6 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Selamat datang kembali!
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
              <Link
                href="/dashboard"
                className="transition hover:text-foreground"
              >
                Beranda
              </Link>
              <Link
                href="/dashboard/absen"
                className="transition hover:text-foreground"
              >
                Absen
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <LogoutButton />
            </div>
          </div>
        </nav>

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
