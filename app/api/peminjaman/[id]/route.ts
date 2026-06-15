import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("sarpras_admin")?.value === "true";
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const status = String(body.status || "");

    if (!["MENUNGGU", "DISETUJUI", "DITOLAK", "SELESAI"].includes(status)) {
      return NextResponse.json(
        { message: "Status tidak valid." },
        { status: 400 }
      );
    }

    const data = await prisma.peminjaman.update({
      where: { id: Number(id) },
      data: {
        status: status as "MENUNGGU" | "DISETUJUI" | "DITOLAK" | "SELESAI",
      },
    });

    return NextResponse.json({
      message: "Status berhasil diperbarui.",
      data,
    });
  } catch {
    return NextResponse.json(
      { message: "Gagal memperbarui status." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 401 });
  }

  try {
    const { id } = await params;

    await prisma.peminjaman.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Data berhasil dihapus." });
  } catch {
    return NextResponse.json(
      { message: "Gagal menghapus data." },
      { status: 500 }
    );
  }
}