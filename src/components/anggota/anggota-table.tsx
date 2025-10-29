"use client";

import { useState } from "react";
import { Anggota } from "@/types/anggota";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AnggotaDialog from "./anggota-dialog";
import AnggotaList from "./anggota-list";

interface AnggotaTableProps {
  initialData: Anggota[];
}

export default function AnggotaTable({ initialData }: AnggotaTableProps) {
  const [anggota, setAnggota] = useState<Anggota[]>(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAnggota, setSelectedAnggota] = useState<Anggota | null>(null);

  const handleAdd = () => {
    setSelectedAnggota(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Anggota) => {
    setSelectedAnggota(item);
    setIsDialogOpen(true);
  };

  const handleSuccess = (newAnggota: Anggota) => {
    if (selectedAnggota) {
      // Update
      setAnggota(anggota.map((a) => (a.id === newAnggota.id ? newAnggota : a)));
    } else {
      // Add
      setAnggota([newAnggota, ...anggota]);
    }
    setIsDialogOpen(false);
    setSelectedAnggota(null);
  };

  const handleDelete = (id: string) => {
    setAnggota(anggota.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">
            Total: <span className="font-semibold">{anggota.length}</span>{" "}
            anggota
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Anggota
        </Button>
      </div>

      <AnggotaList data={anggota} onEdit={handleEdit} onDelete={handleDelete} />

      <AnggotaDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        anggota={selectedAnggota}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
