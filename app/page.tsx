"use client";

import { useEffect, useMemo, useState } from "react";
import { RUANGAN_LIST, STATUS_LABEL, formatTanggal, statusBadgeClass } from "@/lib/utils";

type Peminjaman = {
  id: number;
  nama: string;
  bagian: string;
  noHp: string;
  ruangan: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  keperluan: string;
  status: string;
};

export default function HomePage() {
  const [jadwal, setJadwal] = useState<Peminjaman[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterRuangan, setFilterRuangan] = useState("Semua");

  async function loadJadwal() {
    const res = await fetch("/api/peminjaman", { cache: "no-store" });
    const data = await res.json();
    setJadwal(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    loadJadwal();
  }, []);

  const jadwalTampil = useMemo(() => {
    if (filterRuangan === "Semua") return jadwal;
    return jadwal.filter((item) => item.ruangan === filterRuangan);
  }, [jadwal, filterRuangan]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const payload = {
      nama: form.get("nama"),
      bagian: form.get("bagian"),
      noHp: form.get("noHp"),
      ruangan: form.get("ruangan"),
      tanggal: form.get("tanggal"),
      jamMulai: form.get("jamMulai"),
      jamSelesai: form.get("jamSelesai"),
      keperluan: form.get("keperluan"),
    };

    const res = await fetch("/api/peminjaman", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setMessage(data.message || "Terjadi kesalahan.");

    if (res.ok) {
      e.currentTarget.reset();
      loadJadwal();
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">
            SMA Negeri 1 Jember
          </p>
          <h1 className="text-3xl font-bold md:text-5xl">
            Peminjaman Sarpras Sekolah
          </h1>
          <p className="mt-3 max-w-2xl text-blue-50">
            Ajukan peminjaman Aula Madya, Aula Djarkasi, dan Aula Pratama.
            Sistem akan otomatis menolak jadwal yang bentrok.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[420px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
        >
          <h2 className="text-xl font-bold text-slate-900">Form Pengajuan</h2>
          <p className="mt-1 text-sm text-slate-500">
            Jadwal berstatus Menunggu dan Disetujui akan mengunci ruangan.
          </p>

          <div className="mt-5 space-y-3">
            <input name="nama" required placeholder="Nama peminjam" className="w-full rounded-xl border border-slate-300 p-3" />
            <input name="bagian" required placeholder="Bagian/instansi" className="w-full rounded-xl border border-slate-300 p-3" />
            <input name="noHp" required placeholder="Nomor HP/WhatsApp" className="w-full rounded-xl border border-slate-300 p-3" />

            <select name="ruangan" required className="w-full rounded-xl border border-slate-300 p-3">
              {RUANGAN_LIST.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input name="tanggal" required type="date" className="rounded-xl border border-slate-300 p-3" />
              <input name="jamMulai" required type="time" className="rounded-xl border border-slate-300 p-3" />
              <input name="jamSelesai" required type="time" className="rounded-xl border border-slate-300 p-3" />
            </div>

            <textarea
              name="keperluan"
              required
              placeholder="Keperluan peminjaman"
              rows={4}
              className="w-full rounded-xl border border-slate-300 p-3"
            />

            <button
              disabled={loading}
              className="w-full rounded-xl bg-blue-700 p-3 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
            >
              {loading ? "Mengirim..." : "Ajukan Peminjaman"}
            </button>

            {message && (
              <div className="rounded-xl bg-blue-50 p-3 text-sm font-medium text-blue-800 ring-1 ring-blue-100">
                {message}
              </div>
            )}
          </div>
        </form>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Daftar Jadwal</h2>
              <p className="mt-1 text-sm text-slate-500">
                Lihat jadwal peminjaman yang sudah masuk.
              </p>
            </div>

            <select
              value={filterRuangan}
              onChange={(e) => setFilterRuangan(e.target.value)}
              className="rounded-xl border border-slate-300 p-3"
            >
              <option>Semua</option>
              {RUANGAN_LIST.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="mt-5 space-y-3">
            {jadwalTampil.length === 0 && (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                Belum ada jadwal peminjaman.
              </p>
            )}

            {jadwalTampil.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <div>
                    <p className="font-bold text-slate-900">{item.ruangan}</p>
                    <p className="text-sm text-slate-500">
                      {formatTanggal(item.tanggal)} • {item.jamMulai} - {item.jamSelesai}
                    </p>
                  </div>
                  <span className={`h-fit w-fit rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusBadgeClass(item.status)}`}>
                    {STATUS_LABEL[item.status] || item.status}
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-700">{item.keperluan}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Peminjam: {item.nama} • {item.bagian}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
