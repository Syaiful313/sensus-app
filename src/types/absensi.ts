export type StatusAbsen = "hadir" | "telat" | "ijin" | "tidak_hadir";

export interface Absensi {
  id: string;
  anggota_id: string;
  tanggal: string;
  status: StatusAbsen;
  alasan: string | null;
  created_at: string;
  updated_at: string;
}

export interface AbsensiWithAnggota extends Absensi {
  anggota: {
    id: string;
    nama: string;
    dapukan: string;
  };
}

export interface AbsensiFormData {
  anggota_id: string;
  tanggal: string;
  status: StatusAbsen;
  alasan?: string;
}
