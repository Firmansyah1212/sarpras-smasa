# Aplikasi Peminjaman Sarpras Sekolah

Project ini dibuat untuk peminjaman ruangan sekolah dan siap dideploy ke Vercel.

## Ruangan
- Aula Madya
- Aula Djarkasi
- Aula Pratama

## Fitur
- Form pengajuan peminjaman
- Cek bentrok jadwal otomatis
- Status: MENUNGGU, DISETUJUI, DITOLAK, SELESAI
- Jadwal MENUNGGU dan DISETUJUI mengunci ruangan
- Admin bisa menyetujui, menolak, menyelesaikan, dan menghapus pengajuan
- Tampilan responsif dengan Tailwind CSS
- Siap deploy ke Vercel

## Cara Install Lokal

```bash
npm install
```

Buat file `.env` dari `.env.example`, lalu isi:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
ADMIN_PASSWORD="passwordadmin"
```

Push database:

```bash
npx prisma db push
```

Jalankan:

```bash
npm run dev
```

Buka:

```text
http://localhost:3000
```

Admin:

```text
http://localhost:3000/admin
```

## Deploy ke Vercel

1. Upload folder ini ke GitHub.
2. Import repository ke Vercel.
3. Tambahkan Environment Variables:
   - `DATABASE_URL`
   - `ADMIN_PASSWORD`
4. Deploy.
5. Setelah deploy, buka terminal lokal dan jalankan:

```bash
npx prisma db push
```

atau jika memakai migration:

```bash
npx prisma migrate deploy
```

## Database Gratis yang Bisa Dipakai
- Supabase PostgreSQL
- Neon PostgreSQL
- Prisma Postgres

## Catatan Penting
Vercel tidak cocok untuk menyimpan data tanpa database. Karena itu aplikasi ini memakai PostgreSQL lewat `DATABASE_URL`.
