"use client";

import { useState, useEffect } from "react";
import {
  AbsensiWithAnggota,
  AbsensiFormData,
  StatusAbsen,
} from "@/types/absensi";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AbsensiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  absensi: AbsensiWithAnggota | null;
  anggotaList: { id: string; nama: string; dapukan: string }[];
  selectedDate: string;
  onSuccess: (absensi: AbsensiWithAnggota) => void;
}

export default function AbsensiDialog({
  open,
  onOpenChange,
  absensi,
  anggotaList,
  selectedDate,
  onSuccess,
}: AbsensiDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const [formData, setFormData] = useState<AbsensiFormData>({
    anggota_id: "",
    tanggal: selectedDate,
    status: "hadir",
    alasan: "",
  });

  useEffect(() => {
    if (absensi) {
      setFormData({
        anggota_id: absensi.anggota_id,
        tanggal: absensi.tanggal,
        status: absensi.status,
        alasan: absensi.alasan || "",
      });
    } else {
      setFormData({
        anggota_id: "",
        tanggal: selectedDate,
        status: "hadir",
        alasan: "",
      });
    }
    setError(null);
  }, [absensi, open, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSave = {
        ...formData,
        alasan: formData.alasan?.trim() || null,
      };

      if (absensi) {
        // Update
        const { data, error } = await supabase
          .from("absensi")
          .update(dataToSave)
          .eq("id", absensi.id)
          .select(
            `
            *,
            anggota:anggota_id (
              id,
              nama,
              dapukan
            )
          `
          )
          .single();

        if (error) throw error;
        onSuccess(data);
      } else {
        // Insert
        const { data, error } = await supabase
          .from("absensi")
          .insert([dataToSave])
          .select(
            `
            *,
            anggota:anggota_id (
              id,
              nama,
              dapukan
            )
          `
          )
          .single();

        if (error) {
          if (error.code === "23505") {
            throw new Error(
              "Anggota ini sudah diabsen untuk tanggal yang dipilih"
            );
          }
          throw error;
        }
        onSuccess(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const needsReason =
    formData.status === "ijin" || formData.status === "tidak_hadir";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {absensi ? "Edit Absensi" : "Tambah Absensi"}
          </DialogTitle>
          <DialogDescription>
            {absensi
              ? "Ubah data absensi di bawah ini."
              : "Isi form di bawah ini untuk mencatat absensi."}
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
              <Label htmlFor="anggota_id">Nama Anggota</Label>
              <Select
                value={formData.anggota_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, anggota_id: value })
                }
                disabled={!!absensi}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih anggota" />
                </SelectTrigger>
                <SelectContent>
                  {anggotaList.map((anggota) => (
                    <SelectItem key={anggota.id} value={anggota.id}>
                      {anggota.nama} ({anggota.dapukan})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status Kehadiran</Label>
              <Select
                value={formData.status}
                onValueChange={(value: StatusAbsen) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hadir">Hadir</SelectItem>
                  <SelectItem value="telat">Telat</SelectItem>
                  <SelectItem value="ijin">Ijin</SelectItem>
                  <SelectItem value="tidak_hadir">Tidak Hadir</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alasan">
                Alasan {needsReason && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="alasan"
                value={formData.alasan}
                onChange={(e) =>
                  setFormData({ ...formData, alasan: e.target.value })
                }
                placeholder={
                  needsReason
                    ? "Wajib diisi untuk status ijin/tidak hadir"
                    : "Opsional"
                }
                rows={3}
                required={needsReason}
              />
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
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
