"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-sky-50 via-white to-blue-100">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-4 py-16 lg:flex-row lg:justify-between lg:px-12">
          <section className="max-w-xl space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm ring-1 ring-sky-100 backdrop-blur">
              Sukses membuat akun
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl lg:text-5xl">
              Tinggal selangkah lagi untuk mulai memakai aplikasi.
            </h1>
            <p className="text-base leading-relaxed text-gray-600">
              Buka email Anda dan konfirmasi pendaftaran supaya bisa mengakses
              seluruh fitur sensus digital.
            </p>
          </section>

          <Card className="w-full max-w-md border-0 bg-white/90 shadow-2xl shadow-sky-100 backdrop-blur">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold text-gray-900">
                Cek Email Anda
              </CardTitle>
              <CardDescription className="text-gray-600">
                Kami sudah mengirim link konfirmasi ke{" "}
                <span className="font-semibold text-sky-600">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                onClick={() => router.push("/login")}
                className="h-11 w-full bg-sky-600 text-base font-semibold transition hover:bg-sky-700"
              >
                Kembali ke Login
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-sky-50 via-white to-blue-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-4 py-16 lg:flex-row lg:justify-between lg:px-12">
        <section className="max-w-xl space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm ring-1 ring-sky-100 backdrop-blur">
            Daftar akun baru
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl lg:text-5xl">
            Mulai kelola sensus dengan mudah dan terstruktur.
          </h1>
          <p className="text-base leading-relaxed text-gray-600">
            Buat akun Anda dalam hitungan menit dan nikmati fitur pendataan
            modern yang responsif di berbagai perangkat.
          </p>
          <div className="hidden gap-4 text-sm font-medium text-gray-500 sm:flex">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-1.5 rounded-full bg-emerald-400" />
              Validasi real-time
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex size-1.5 rounded-full bg-emerald-400" />
              Kolaborasi tim
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex size-1.5 rounded-full bg-emerald-400" />
              Laporan otomatis
            </div>
          </div>
        </section>

        <Card className="w-full max-w-md border-0 bg-white/90 shadow-2xl shadow-sky-100 backdrop-blur">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Daftar
            </CardTitle>
            <CardDescription className="text-gray-600">
              Lengkapi data di bawah ini untuk membuat akun baru
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleRegister} className="space-y-6">
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              <div className="space-y-2 text-left">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 border-slate-200 bg-white focus-visible:ring-sky-500"
                />
              </div>
              <div className="space-y-2 text-left">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-11 border-slate-200 bg-white focus-visible:ring-sky-500"
                />
              </div>
              <div className="space-y-2 text-left">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-11 border-slate-200 bg-white focus-visible:ring-sky-500"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="h-11 w-full bg-sky-600 text-base font-semibold transition hover:bg-sky-700"
                disabled={loading}
              >
                {loading ? "Membuat akun..." : "Daftar"}
              </Button>
              <p className="text-sm text-center text-gray-600">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-sky-600 transition hover:text-sky-700"
                >
                  Login
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
