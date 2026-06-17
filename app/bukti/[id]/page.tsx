import Image from "next/image";
import { prisma } from "@/lib/prisma";

function formatTanggal(date: Date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

const STATUS_LABEL: Record<string, string> = {
  MENUNGGU: "Menunggu",
  DISETUJUI: "Disetujui",
  DITOLAK: "Ditolak",
  SELESAI: "Selesai",
};

export default async function BuktiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await prisma.peminjaman.findUnique({
    where: { id: Number(id) },
  });

  if (!data) {
    return <div className="p-10">Data peminjaman tidak ditemukan.</div>;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 print:bg-white">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow print:shadow-none">
        <div className="flex items-center gap-4 border-b pb-5">
          <Image
            src="/Logo_sman1jember.png"
            alt="Logo SMA Negeri 1 Jember"
            width={80}
            height={80}
          />

          <div>
            <h1 className="text-xl font-bold uppercase">
              Bukti Persetujuan Peminjaman Sarpras
            </h1>
            <p className="font-semibold">SMA Negeri 1 Jember</p>
          </div>
        </div>

        <div className="mt-6 text-sm">
          <p>
            Nomor Bukti: <b>SARPRAS-{String(data.id).padStart(4, "0")}</b>
          </p>
          <p>
            Status: <b>{STATUS_LABEL[data.status] || data.status}</b>
          </p>
        </div>

        <table className="mt-6 w-full text-sm">
          <tbody>
            <tr><td className="w-44 py-2 font-semibold">Nama Peminjam</td><td>: {data.nama}</td></tr>
            <tr><td className="py-2 font-semibold">Bagian/Instansi</td><td>: {data.bagian}</td></tr>
            <tr><td className="py-2 font-semibold">Nomor HP</td><td>: {data.noHp}</td></tr>
            <tr><td className="py-2 font-semibold">Ruangan</td><td>: {data.ruangan}</td></tr>
            <tr><td className="py-2 font-semibold">Tanggal</td><td>: {formatTanggal(data.tanggal)}</td></tr>
            <tr><td className="py-2 font-semibold">Waktu</td><td>: {data.jamMulai} - {data.jamSelesai}</td></tr>
            <tr><td className="py-2 font-semibold">Keperluan</td><td>: {data.keperluan}</td></tr>
          </tbody>
        </table>

        <div className="mt-10 flex justify-between text-sm">
          <div>
            <p>Peminjam,</p>
            <div className="h-20"></div>
            <p className="font-semibold">{data.nama}</p>
          </div>

          <div className="text-center">
            <p>Mengetahui,</p>
            <p>Pengelola Sarpras</p>
            <div className="h-20"></div>
            <p className="font-semibold">Admin Sarpras</p>
          </div>
        </div>

        <div className="mt-8 print:hidden">
          <button
            onClick={() => window.print()}
            className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white"
          >
            Cetak / Simpan PDF
          </button>
        </div>
      </div>
    </main>
  );
}