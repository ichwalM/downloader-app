import Downloader from "@/components/Downloader";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0b12] text-white">
      <div className="pointer-events-none absolute left-1/2 top-[-20%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-sky-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-25%] right-[-10%] h-[420px] w-[420px] rounded-full bg-purple-500/20 blur-[140px]" />

      <main className="relative mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-16 md:px-8 md:py-20">
        <header className="space-y-5 text-center">
          <div className="mx-auto w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-zinc-300">
            Modern Media Downloader
          </div>
          <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
            Download YouTube audio & TikTok video dengan pengalaman premium.
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-zinc-300 md:text-base">
            Interface clean bergaya Linear, auto-detect platform, preview instan, dan
            progress bar yang smooth. Fokus pada kecepatan dan kenyamanan.
          </p>
        </header>

        <Downloader />
      </main>
    </div>
  );
}
