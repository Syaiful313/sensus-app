"use client";

import { Anggota } from "@/types/anggota";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
} from "../ui/alert-dialog";
import { Badge } from "../ui/badge";

interface AnggotaListProps {
  data: Anggota[];
  onEdit: (anggota: Anggota) => void;
  onDelete: (id: string) => void;
}

export default function AnggotaList({
  data,
  onEdit,
  onDelete,
}: AnggotaListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    setLoading(true);
    const { error } = await supabase
      .from("anggota")
      .delete()
      .eq("id", deleteId);

    if (!error) {
      onDelete(deleteId);
    }

    setLoading(false);
    setDeleteId(null);
  };

  const getDapukanBadge = (dapukan: string) => {
    return dapukan === "pengurus" ? (
      <Badge variant="default">Pengurus</Badge>
    ) : (
      <Badge variant="secondary">Rokyah</Badge>
    );
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Belum ada data anggota. Klik tombol "Tambah Anggota" untuk menambahkan.
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
              <TableHead>Tempat, Tanggal Lahir</TableHead>
              <TableHead>Jenis Kelamin</TableHead>
              <TableHead>Dapukan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item.nama}</TableCell>
                <TableCell>
                  {item.tempat_lahir}, {formatDate(item.tanggal_lahir)}
                </TableCell>
                <TableCell>{item.jenis_kelamin}</TableCell>
                <TableCell>{getDapukanBadge(item.dapukan)}</TableCell>
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
            <AlertDialogTitle>Hapus Anggota?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data anggota akan dihapus
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
