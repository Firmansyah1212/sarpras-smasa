"use client";

import { useEffect, useState } from "react";
import { STATUS_LABEL, formatTanggal, statusBadgeClass } from "@/lib/utils";

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

export default function AdminPage() {
  const [data, setData] = useState<Peminjaman[]>([]);
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [message, setMessage] = useState("");

  async function loadData() {
    const res = await fetch("/api/peminjaman", { cache: "no-store" });
    const json = await res.json();
    setData(Array.isArray(json) ? json : []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

   let json = { message: "Terjadi kesalahan." };

try {
  json = await res.json();
} catch {
  json = {
    message: "Server error. Cek file .env dan restart server.",
  };
}

setMessage(json.message || "");

    if (res.ok) {
      setIsLogin(true);
      setPassword("");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsLogin(false);
  }

  async function updateStatus(id: number, status: string) {
  const res = await fetch(`/api/peminjaman/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  let json = { message: "Terjadi kesalahan." };

  try {
    json = await res.json();
  } catch {
    json = {
      message: "Server error saat update status. Cek terminal Git Bash.",
    };
  }

  setMessage(json.message || "");

  if (res.ok) loadData();
}

  async function hapus(id: number) {
  const yakin = confirm("Yakin ingin menghapus data ini?");
  if (!yakin) return;

  const res = await fetch(`/api/peminjaman/${id}`, {
    method: "DELETE",
  });

  let json = { message: "Terjadi kesalahan." };

  try {
    json = await res.json();
  } catch {
    json = {
      message: "Server error saat menghapus data. Cek terminal Git Bash.",
    };
  }

  setMessage(json.message || "");

  if (res.ok) loadData();
}

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
              Dashboard Admin
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Peminjaman Sarpras
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Kelola pengajuan peminjaman ruangan sekolah.
            </p>
          </div>

          {isLogin ? (
            <button onClick={logout} className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white">
              Logout Admin
            </button>
          ) : (
            <form onSubmit={login} className="flex flex-col gap-2 sm:flex-row">
              <input
                type="password"
                placeholder="Password admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border border-slate-300 p-3"
              />
              <button className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white">
                Login
              </button>
            </form>
          )}
        </div>

        {message && (
          <div className="mb-4 rounded-xl bg-blue-50 p-3 text-sm font-medium text-blue-800 ring-1 ring-blue-100">
            {message}
          </div>
        )}

        {!isLogin && (
          <div className="mb-4 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800 ring-1 ring-yellow-100">
            Login admin diperlukan untuk menyetujui, menolak, menyelesaikan, atau menghapus data.
            Kamu tetap bisa melihat daftar pengajuan.
          </div>
        )}

        <div className="overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="p-4">Peminjam</th>
                <th className="p-4">Ruangan</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Jam</th>
                <th className="p-4">Keperluan</th>
                <th className="p-4">Status</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 align-top">
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{item.nama}</p>
                    <p className="text-slate-500">{item.bagian}</p>
                    <p className="text-slate-500">{item.noHp}</p>
                  </td>
                  <td className="p-4 font-semibold">{item.ruangan}</td>
                  <td className="p-4">{formatTanggal(item.tanggal)}</td>
                  <td className="p-4">{item.jamMulai} - {item.jamSelesai}</td>
                  <td className="max-w-xs p-4">{item.keperluan}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusBadgeClass(item.status)}`}>
                      {STATUS_LABEL[item.status] || item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={!isLogin}
                        onClick={() => updateStatus(item.id, "DISETUJUI")}
                        className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
                      >
                        Setujui
                      </button>
                      <button
                        disabled={!isLogin}
                        onClick={() => updateStatus(item.id, "DITOLAK")}
                        className="rounded-lg bg-yellow-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
                      >
                        Tolak
                      </button>
                      <button
                        disabled={!isLogin}
                        onClick={() => updateStatus(item.id, "SELESAI")}
                        className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
                      >
                        Selesai
                      </button>
                      <button
                        disabled={!isLogin}
                        onClick={() => hapus(item.id)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {data.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Belum ada data peminjaman.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
