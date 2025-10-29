"use client";

import { useState, useEffect } from "react";
import {
  Anggota,
  AnggotaFormData,
  Dapukan,
  JenisKelamin,
} from "@/types/anggota";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AnggotaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anggota: Anggota | null;
  onSuccess: (anggota: Anggota) => void;
}

export default function AnggotaDialog({
  open,
  onOpenChange,
  anggota,
  onSuccess,
}: AnggotaDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const [formData, setFormData] = useState<AnggotaFormData>({
    nama: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "Laki-laki",
    dapukan: "pengurus",
  });

  useEffect(() => {
    if (anggota) {
      setFormData({
        nama: anggota.nama,
        tempat_lahir: anggota.tempat_lahir,
        tanggal_lahir: anggota.tanggal_lahir,
        jenis_kelamin: anggota.jenis_kelamin,
        dapukan: anggota.dapukan,
      });
    } else {
      setFormData({
        nama: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        jenis_kelamin: "Laki-laki",
        dapukan: "pengurus",
      });
    }
    setError(null);
  }, [anggota, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (anggota) {
        // Update
        const { data, error } = await supabase
          .from("anggota")
          .update(formData)
          .eq("id", anggota.id)
          .select()
          .single();

        if (error) throw error;
        onSuccess(data);
      } else {
        // Insert
        const { data, error } = await supabase
          .from("anggota")
          .insert([formData])
          .select()
          .single();

        if (error) throw error;
        onSuccess(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {anggota ? "Edit Anggota" : "Tambah Anggota"}
          </DialogTitle>
          <DialogDescription>
            {anggota
              ? "Ubah data anggota di bawah ini."
              : "Isi form di bawah ini untuk menambah anggota baru."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
              <Input
                id="tempat_lahir"
                value={formData.tempat_lahir}
                onChange={(e) =>
                  setFormData({ ...formData, tempat_lahir: e.target.value })
                }
                placeholder="Masukkan tempat lahir"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
              <Input
                id="tanggal_lahir"
                type="date"
                value={formData.tanggal_lahir}
                onChange={(e) =>
                  setFormData({ ...formData, tanggal_lahir: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
              <Select
                value={formData.jenis_kelamin}
                onValueChange={(value: JenisKelamin) =>
                  setFormData({ ...formData, jenis_kelamin: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dapukan">Dapukan</Label>
              <Select
                value={formData.dapukan}
                onValueChange={(value: Dapukan) =>
                  setFormData({ ...formData, dapukan: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pengurus">Pengurus</SelectItem>
                  <SelectItem value="rokyah">Rokyah</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 font-semibold transition hover:bg-sky-700 sm:w-auto"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
