"use client";

import { useState } from "react";
import { AbsensiWithAnggota } from "@/types/absensi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Calendar } from "lucide-react";
import AbsensiDialog from "./absensi-dialog";
import AbsensiList from "./absensi-list";
import { createClient } from "@/lib/supabase/client";

interface AbsensiContainerProps {
  initialAbsensi: AbsensiWithAnggota[];
  anggotaList: { id: string; nama: string; dapukan: string }[];
  initialDate: string;
}

export default function AbsensiContainer({
  initialAbsensi,
  anggotaList,
  initialDate,
}: AbsensiContainerProps) {
  const [absensi, setAbsensi] = useState<AbsensiWithAnggota[]>(initialAbsensi);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAbsensi, setSelectedAbsensi] =
    useState<AbsensiWithAnggota | null>(null);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const loadAbsensiByDate = async (date: string) => {
    setLoading(true);
    const { data } = await supabase
      .from("absensi")
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
      .eq("tanggal", date)
      .order("created_at", { ascending: false });

    setAbsensi(data || []);
    setLoading(false);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    loadAbsensiByDate(date);
  };

  const handleAdd = () => {
    setSelectedAbsensi(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: AbsensiWithAnggota) => {
    setSelectedAbsensi(item);
    setIsDialogOpen(true);
  };

  const handleSuccess = (newAbsensi: AbsensiWithAnggota) => {
    if (selectedAbsensi) {
      // Update
      setAbsensi(absensi.map((a) => (a.id === newAbsensi.id ? newAbsensi : a)));
    } else {
      // Add
      setAbsensi([newAbsensi, ...absensi]);
    }
    setIsDialogOpen(false);
    setSelectedAbsensi(null);
  };

  const handleDelete = (id: string) => {
    setAbsensi(absensi.filter((a) => a.id !== id));
  };

  const getStatistics = () => {
    const hadir = absensi.filter((a) => a.status === "hadir").length;
    const telat = absensi.filter((a) => a.status === "telat").length;
    const ijin = absensi.filter((a) => a.status === "ijin").length;
    const tidakHadir = absensi.filter((a) => a.status === "tidak_hadir").length;

    return { hadir, telat, ijin, tidakHadir, total: absensi.length };
  };

  const stats = getStatistics();

  return (
    <div className="space-y-6">
      {/* Date Picker & Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Calendar className="h-5 w-5 text-gray-500" />
          <div className="flex-1 sm:flex-none">
            <Label htmlFor="date" className="sr-only">
              Pilih Tanggal
            </Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full sm:w-auto"
            />
          </div>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Absensi
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Hadir</p>
          <p className="text-2xl font-bold text-blue-700">{stats.hadir}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-600 font-medium">Telat</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.telat}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Ijin</p>
          <p className="text-2xl font-bold text-green-700">{stats.ijin}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-600 font-medium">Tidak Hadir</p>
          <p className="text-2xl font-bold text-red-700">{stats.tidakHadir}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 font-medium">Total</p>
          <p className="text-2xl font-bold text-gray-700">{stats.total}</p>
        </div>
      </div>

      {/* Absensi List */}
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <AbsensiList
          data={absensi}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Dialog */}
      <AbsensiDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        absensi={selectedAbsensi}
        anggotaList={anggotaList}
        selectedDate={selectedDate}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
