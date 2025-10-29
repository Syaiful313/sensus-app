"use client";

import { AbsensiWithAnggota } from "@/types/absensi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AbsensiListProps {
  data: AbsensiWithAnggota[];
  onEdit: (absensi: AbsensiWithAnggota) => void;
  onDelete: (id: string) => void;
}

export default function AbsensiList({
  data,
  onEdit,
  onDelete,
}: AbsensiListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    setLoading(true);
    const { error } = await supabase
      .from("absensi")
      .delete()
      .eq("id", deleteId);

    if (!error) {
      onDelete(deleteId);
    }

    setLoading(false);
    setDeleteId(null);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      hadir: { variant: "default", label: "Hadir", className: "bg-blue-500" },
      telat: {
        variant: "secondary",
        label: "Telat",
        className: "bg-yellow-500 text-white",
      },
      ijin: {
        variant: "outline",
        label: "Ijin",
        className: "bg-green-500 text-white",
      },
      tidak_hadir: { variant: "destructive", label: "Tidak Hadir" },
    };

    const config = variants[status] || variants.hadir;

    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Belum ada data absensi untuk tanggal ini.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Dapukan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Alasan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item.anggota.nama}</TableCell>
                <TableCell className="capitalize">
                  {item.anggota.dapukan}
                </TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>
                  {item.alasan ? (
                    <span className="text-sm text-gray-600">{item.alasan}</span>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setDeleteId(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Absensi?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data absensi akan dihapus
              permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
