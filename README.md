# Downloader App

Aplikasi web untuk mengunduh media:
- YouTube: ekstrak audio (MP3)
- TikTok: unduh video (MP4)
- Auto-detect platform dari URL, preview metadata, dan pengalaman UI modern.

Hak Cipta © Ichwal-dev • Portofolio: https://app.walldev.my.id

## Ringkasan

Stack utama:
- Next.js 16 (App Router, runtime Node.js)
- React 19 + React Compiler
- TypeScript 5
- Tailwind CSS 4
- framer-motion, lucide-react
- @distube/ytdl-core (YouTube) dan tiktok-scraper-ts (TikTok)

Fitur:
- Deteksi otomatis platform (YouTube/TikTok)
- Preview judul, thumbnail, dan durasi
- Unduh audio YouTube (MP3) atau video TikTok (MP4)
- UI bersih, responsif, dan progres loading yang halus

## Arsitektur Singkat

Direktori utama:
- `src/app/page.tsx` — halaman beranda dan layout
- `src/components/Downloader.tsx` — komponen utama input URL, preview, dan aksi unduh
- `src/app/api/resolve/route.ts` — API untuk mengambil metadata (judul, thumbnail, durasi)
- `src/app/api/download/route.ts` — API untuk streaming konten sebagai file unduhan
- `src/lib/media.ts` — utilitas: validasi URL, deteksi platform, format durasi, sanitasi nama file
- `next.config.ts` — konfigurasi Next (React Compiler, izin domain gambar)

Alur kerja:
1) Pengguna menempel URL di halaman
2) Frontend memanggil `/api/resolve` untuk preview
3) Saat unduh, frontend mengarahkan ke `/api/download?url=...&platform=...` untuk streaming file

## Prasyarat

- Node.js LTS terbaru (disarankan v18+)
- Paket manajer: npm/yarn/pnpm/bun (bebas)

## Instalasi

```bash
npm install
# atau
yarn
# atau
pnpm install
# atau
bun install
```

## Menjalankan

Pengembangan:
```bash
npm run dev
```

Produksi:
```bash
npm run build
npm start
```

Port tertentu (contoh 3100):
```bash
npm run build
npm run start:3100
```
Alternatif via environment variable (PowerShell):
```bash
$env:PORT=3100; npm start
```

Lint:
```bash
npm run lint
```

## API Endpoints

- `POST /api/resolve`
  - Body: `{ "url": "https://..." }`
  - Respons: `{ platform, title, thumbnail, duration }`
  - Validasi: hanya URL YouTube atau TikTok

- `GET /api/download?url=...&platform=...`
  - Mengalirkan konten sebagai file unduhan
  - YouTube: audio/mpeg (.mp3)
  - TikTok: video/mp4 (.mp4)

## Konfigurasi Gambar

Domain gambar yang diizinkan ada di `next.config.ts` (YouTube thumbnail dan beberapa domain TikTok CDN). Jika thumbnail dari domain lain dibutuhkan, tambahkan pola domain ke konfigurasi `images.remotePatterns`.

## Catatan & Keterbatasan

- YouTube menggunakan `@distube/ytdl-core` dengan header agen khusus untuk stabilitas.
- TikTok menggunakan `tiktok-scraper-ts`; beberapa konten mungkin membatasi `downloadURL` dan fallback ke `playURL`.
- Perubahan kebijakan platform bisa mempengaruhi ketersediaan metadata/unduhan.

## Hak Cipta & Lisensi

Hak Cipta © Ichwal-dev. Seluruh hak dilindungi undang-undang.
Jika ingin menambah lisensi terbuka (misal MIT), tambahkan berkas LISENSI dan sesuaikan pernyataan hak cipta ini.

## Penulis

- Ichwal-dev
- Portofolio: https://app.walldev.my.id

## Referensi

- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com
- ytdl-core (Distube fork): https://github.com/distubejs/ytdl-core
- tiktok-scraper-ts: https://www.npmjs.com/package/tiktok-scraper-ts
