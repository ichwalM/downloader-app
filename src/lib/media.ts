export type Platform = "youtube" | "tiktok";

export const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const detectPlatform = (value: string): Platform | null => {
  if (!value) return null;
  const url = value.toLowerCase();
  if (/(youtube\.com|youtu\.be)/.test(url)) return "youtube";
  if (/tiktok\.com/.test(url)) return "tiktok";
  return null;
};

export const formatDuration = (totalSeconds?: number) => {
  if (!totalSeconds && totalSeconds !== 0) return "—";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}:${String(mins).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${mins}:${String(seconds).padStart(2, "0")}`;
};

export const sanitizeFilename = (value: string) =>
  value.replace(/[<>:"/\\|?*\u0000-\u001F]/g, "").slice(0, 120).trim() ||
  "download";
