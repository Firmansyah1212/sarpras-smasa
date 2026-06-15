import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeDateOnly, RUANGAN_LIST, timeToMinutes } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await prisma.peminjaman.findMany({
      orderBy: [{ tanggal: "asc" }, { jamMulai: "asc" }],
    });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Gagal mengambil data peminjaman." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const nama = String(body.nama || "").trim();
    const bagian = String(body.bagian || "").trim();
    const noHp = String(body.noHp || "").trim();
    const ruangan = String(body.ruangan || "").trim();
    const tanggal = String(body.tanggal || "").trim();
    const jamMulai = String(body.jamMulai || "").trim();
    const jamSelesai = String(body.jamSelesai || "").trim();
    const keperluan = String(body.keperluan || "").trim();

    if (!nama || !bagian || !noHp || !ruangan || !tanggal || !jamMulai || !jamSelesai || !keperluan) {
      return NextResponse.json(
        { message: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    if (!RUANGAN_LIST.includes(ruangan)) {
      return NextResponse.json(
        { message: "Ruangan tidak valid." },
        { status: 400 }
      );
    }

    if (timeToMinutes(jamMulai) >= timeToMinutes(jamSelesai)) {
      return NextResponse.json(
        { message: "Jam selesai harus lebih besar dari jam mulai." },
        { status: 400 }
      );
    }

    const tanggalObj = normalizeDateOnly(tanggal);

    const jadwalSama = await prisma.peminjaman.findMany({
      where: {
        ruangan,
        tanggal: tanggalObj,
        status: {
          in: ["MENUNGGU", "DISETUJUI"],
        },
      },
    });

    const bentrok = jadwalSama.some((item) => {
      return (
        timeToMinutes(item.jamMulai) < timeToMinutes(jamSelesai) &&
        timeToMinutes(item.jamSelesai) > timeToMinutes(jamMulai)
      );
    });

    if (bentrok) {
      return NextResponse.json(
        { message: `${ruangan} sudah dipinjam pada tanggal dan jam tersebut.` },
        { status: 409 }
      );
    }

    const peminjaman = await prisma.peminjaman.create({
      data: {
        nama,
        bagian,
        noHp,
        ruangan,
        tanggal: tanggalObj,
        jamMulai,
        jamSelesai,
        keperluan,
      },
    });

    return NextResponse.json({
      message: "Pengajuan berhasil dikirim.",
      data: peminjaman,
    });
  } catch {
    return NextResponse.json(
      { message: "Gagal menyimpan pengajuan." },
      { status: 500 }
    );
  }
}
