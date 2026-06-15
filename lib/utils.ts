export const RUANGAN_LIST = ["Aula Madya", "Aula Djarkasi", "Aula Pratama"];

export const STATUS_LABEL: Record<string, string> = {
  MENUNGGU: "Menunggu",
  DISETUJUI: "Disetujui",
  DITOLAK: "Ditolak",
  SELESAI: "Selesai",
};

export function timeToMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

export function normalizeDateOnly(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

export function formatTanggal(date: string | Date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function statusBadgeClass(status: string) {
  if (status === "DISETUJUI") return "bg-green-100 text-green-700 ring-green-200";
  if (status === "DITOLAK") return "bg-red-100 text-red-700 ring-red-200";
  if (status === "SELESAI") return "bg-slate-100 text-slate-700 ring-slate-200";
  return "bg-yellow-100 text-yellow-700 ring-yellow-200";
}
