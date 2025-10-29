export type Dapukan = "pengurus" | "rokyah";

export type JenisKelamin = "Laki-laki" | "Perempuan";

export interface Anggota {
  id: string;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: JenisKelamin;
  dapukan: Dapukan;
  created_at: string;
  updated_at: string;
}

export interface AnggotaFormData {
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: JenisKelamin;
  dapukan: Dapukan;
}
