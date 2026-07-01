import Image from "next/image";

export default function Header() {
  return (
    <section className="bg-gradient-to-r from-blue-800 to-blue-600 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <Image
            src="/Logo_sman1jember.png"
            alt="Logo SMA Negeri 1 Jember"
            width={90}
            height={90}
            priority
          />

          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">
              SMA Negeri 1 Jember
            </p>

            <h1 className="text-3xl font-bold md:text-5xl">
              Sistem Peminjaman Sarpras
            </h1>

            <p className="mt-3 max-w-2xl text-blue-50">
              Ajukan peminjaman Aula Madya, Aula Djarkasi, dan Aula Pratama.
              Sistem akan otomatis menolak jadwal yang bentrok.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}