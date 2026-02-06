import { NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";
import { TTScraper } from "tiktok-scraper-ts";
import { detectPlatform, isValidUrl, type Platform } from "@/lib/media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const scraper = new TTScraper();
const ytdlAgent = ytdl.createAgent();
const ytdlRequestOptions = {
  headers: {
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "accept-language": "en-US,en;q=0.9",
  },
};

const youtubeHandler = async (url: string) => {
  try {
    const info = await ytdl.getInfo(url, {
      agent: ytdlAgent,
      requestOptions: ytdlRequestOptions,
    });
    const thumbnail =
      info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]?.url ||
      "";
    return {
      platform: "youtube" as Platform,
      title: info.videoDetails.title,
      thumbnail,
      duration: Number(info.videoDetails.lengthSeconds || 0),
    };
  } catch {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
    );
    if (!response.ok) {
      throw new Error("Gagal mengambil metadata YouTube.");
    }
    const data = (await response.json()) as { title?: string; thumbnail_url?: string };
    return {
      platform: "youtube" as Platform,
      title: data.title || "YouTube Video",
      thumbnail: data.thumbnail_url || "",
      duration: 0,
    };
  }
};

const tiktokHandler = async (url: string) => {
  const info = await scraper.video(url, true);
  if (!info) {
    throw new Error("Gagal mengambil metadata TikTok.");
  }
  const safeInfo = info as NonNullable<typeof info>;
  return {
    platform: "tiktok" as Platform,
    title: safeInfo.description || "TikTok Video",
    thumbnail: safeInfo.cover || "",
    duration: Number(safeInfo.duration || 0),
  };
};

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== "string" || !isValidUrl(url)) {
      return NextResponse.json(
        { message: "URL tidak valid." },
        { status: 400 },
      );
    }

    const platform = detectPlatform(url);
    if (!platform) {
      return NextResponse.json(
        { message: "URL harus dari YouTube atau TikTok." },
        { status: 400 },
      );
    }

    const data = platform === "youtube" ? await youtubeHandler(url) : await tiktokHandler(url);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Gagal mengambil metadata." },
      { status: 500 },
    );
  }
}
