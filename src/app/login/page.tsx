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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-sky-50 via-white to-blue-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-4 py-16 lg:flex-row lg:justify-between lg:px-12">
        <section className="max-w-xl space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm ring-1 ring-sky-100 backdrop-blur">
            Sistem Sensus Digital
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl lg:text-5xl">
            Selamat datang kembali,
            <span className="text-sky-600"> ayo lanjutkan pendataan.</span>
          </h1>
          <p className="text-base leading-relaxed text-gray-600">
            Masuk untuk mengelola data sensus Anda dengan antarmuka yang modern
            dan mudah digunakan. Semua laporan tersimpan rapih dan aman di satu
            tempat.
          </p>
          <div className="hidden gap-4 text-sm font-medium text-gray-500 sm:flex">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-1.5 rounded-full bg-emerald-400" />
              Data terenkripsi
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex size-1.5 rounded-full bg-emerald-400" />
              Dukungan 24/7
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex size-1.5 rounded-full bg-emerald-400" />
              Dashboard real-time
            </div>
          </div>
        </section>

        <Card className="w-full max-w-md border-0 bg-white/90 shadow-2xl shadow-sky-100 backdrop-blur">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Login
            </CardTitle>
            <CardDescription className="text-gray-600">
              Masuk ke akun Anda untuk melanjutkan
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin} className="space-y-6">
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
                {loading ? "Memproses..." : "Masuk"}
              </Button>

              <p className="text-sm text-center text-gray-600">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-sky-600 transition hover:text-sky-700"
                >
                  Daftar sekarang
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
