"use client";

import { motion } from "framer-motion";
import {
  Download,
  Link as LinkIcon,
  Loader2,
  Music2,
  PlaySquare,
  Sparkles,
  TriangleAlert,
  Video,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { detectPlatform, formatDuration, isValidUrl, type Platform } from "@/lib/media";

type PreviewData = {
  platform: Platform;
  title: string;
  thumbnail: string;
  duration: number;
};

type Toast = {
  id: string;
  message: string;
  tone: "error" | "success";
};

const formatLabel = (platform: Platform | null) =>
  platform === "youtube" ? "MP3" : platform === "tiktok" ? "MP4" : "Auto";

export default function Downloader() {
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const platform = useMemo(() => detectPlatform(url), [url]);

  useEffect(() => {
    if (!loading) {
      setProgress(0);
      return;
    }
    setProgress(12);
    const interval = setInterval(() => {
      setProgress((current) => (current < 90 ? current + 6 : current));
    }, 220);
    return () => clearInterval(interval);
  }, [loading]);

  const pushToast = (message: string, tone: Toast["tone"]) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  };

  const handleResolve = async () => {
    if (!isValidUrl(url) || !platform) {
      pushToast("Masukkan URL YouTube atau TikTok yang valid.", "error");
      return;
    }
    setLoading(true);
    setPreview(null);
    try {
      const response = await fetch("/api/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const payload = await response.json();
      if (!response.ok) {
        pushToast(payload?.message || "Gagal mengambil metadata.", "error");
        setLoading(false);
        return;
      }
      setPreview(payload);
      setProgress(100);
      pushToast("Metadata berhasil diambil.", "success");
    } catch {
      pushToast("Terjadi masalah jaringan. Coba lagi.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!preview) return;
    setDownloading(true);
    const query = new URLSearchParams({
      url,
      platform: preview.platform,
    });
    window.location.href = `/api/download?${query.toString()}`;
    setTimeout(() => setDownloading(false), 1500);
  };

  return (
    <div className="relative flex w-full flex-col gap-6">
      <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 text-sm text-zinc-200">
              <Sparkles className="h-4 w-4 text-sky-300" />
              Auto-detect YouTube / TikTok
            </div>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="Tempel URL video di sini..."
                className="h-16 w-full rounded-2xl border border-white/10 bg-black/40 pl-12 pr-4 text-base text-white outline-none ring-0 transition focus:border-sky-400/60 focus:bg-black/60"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-200">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Platform: {platform ? platform.toUpperCase() : "AUTO"}
              </span>
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                {platform === "youtube" ? (
                  <Music2 className="h-4 w-4 text-emerald-300" />
                ) : (
                  <Video className="h-4 w-4 text-purple-300" />
                )}
                Format {formatLabel(platform)}
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleResolve}
            disabled={loading}
            className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500 px-8 text-sm font-semibold text-slate-900 shadow-lg shadow-sky-500/30 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download
          </motion.button>
        </div>

        {loading && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <span>Fetching metadata...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
        {!preview && !loading && (
          <div className="flex flex-col items-center justify-center gap-4 text-center text-zinc-400">
            <PlaySquare className="h-10 w-10 text-zinc-500" />
            <div className="text-sm">
              Tempel URL video untuk melihat preview sebelum download.
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="h-40 w-full animate-pulse rounded-2xl bg-white/10 md:w-64" />
            <div className="flex flex-1 flex-col gap-3">
              <div className="h-6 w-3/4 animate-pulse rounded-full bg-white/10" />
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/10" />
              <div className="h-10 w-40 animate-pulse rounded-2xl bg-white/10" />
            </div>
          </div>
        )}

        {preview && !loading && (
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <div className="relative h-40 w-full overflow-hidden rounded-2xl md:w-64">
              <Image
                src={preview.thumbnail}
                alt={preview.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <div className="text-lg font-semibold text-white">{preview.title}</div>
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Durasi {formatDuration(preview.duration)}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  {preview.platform.toUpperCase()}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownload}
                disabled={downloading}
                className="flex h-12 w-fit items-center gap-2 rounded-2xl bg-white px-6 text-sm font-semibold text-slate-900 transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Download Now
              </motion.button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
          <div className="flex items-center gap-2 text-white">
            <Music2 className="h-4 w-4 text-emerald-300" />
            YouTube Audio
          </div>
          <div className="mt-2 text-xs text-zinc-400">
            Auto convert ke audio, cocok untuk podcast atau musik.
          </div>
        </div>
        <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
          <div className="flex items-center gap-2 text-white">
            <Video className="h-4 w-4 text-purple-300" />
            TikTok Video
          </div>
          <div className="mt-2 text-xs text-zinc-400">
            Download MP4 kualitas terbaik dengan deteksi cepat.
          </div>
        </div>
        <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
          <div className="flex items-center gap-2 text-white">
            <TriangleAlert className="h-4 w-4 text-yellow-300" />
            Error Aware
          </div>
          <div className="mt-2 text-xs text-zinc-400">
            Notifikasi real-time jika URL tidak valid atau API limit.
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed right-6 top-6 z-50 flex w-[280px] flex-col gap-3">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-2xl border px-4 py-3 text-sm shadow-lg ${
              toast.tone === "error"
                ? "border-red-500/40 bg-red-500/10 text-red-100"
                : "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
            }`}
          >
            {toast.message}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
