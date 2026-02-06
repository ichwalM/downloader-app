import { NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";
import { Readable } from "stream";
import type { ReadableStream as NodeReadableStream } from "stream/web";
import { TTScraper } from "tiktok-scraper-ts";
import { detectPlatform, isValidUrl, sanitizeFilename } from "@/lib/media";

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

const streamYoutube = async (url: string) => {
  const info = await ytdl.getBasicInfo(url, {
    agent: ytdlAgent,
    requestOptions: ytdlRequestOptions,
  });
  const title = sanitizeFilename(info.videoDetails.title || "youtube-audio");
  const stream = ytdl(url, {
    filter: "audioonly",
    quality: "highestaudio",
    agent: ytdlAgent,
    requestOptions: ytdlRequestOptions,
  });
  return {
    stream,
    filename: `${title}.mp3`,
    contentType: "audio/mpeg",
  };
};

const streamTikTok = async (url: string) => {
  const info = await scraper.video(url);
  if (!info) {
    throw new Error("Gagal mengambil metadata TikTok.");
  }
  const safeInfo = info as NonNullable<typeof info>;
  const title = sanitizeFilename(safeInfo.description || "tiktok-video");
  const downloadUrl = safeInfo.downloadURL || safeInfo.playURL;
  if (!downloadUrl) {
    throw new Error("Link download TikTok tidak tersedia.");
  }
  const upstream = await fetch(downloadUrl);
  if (!upstream.ok || !upstream.body) {
    throw new Error("Gagal mengambil video dari TikTok.");
  }
  const body = upstream.body as unknown as NodeReadableStream;
  return {
    stream: Readable.fromWeb(body),
    filename: `${title}.mp4`,
    contentType: "video/mp4",
  };
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url") || "";
    const platform = searchParams.get("platform") || detectPlatform(url);

    if (!url || !isValidUrl(url) || !platform) {
      return NextResponse.json({ message: "URL tidak valid." }, { status: 400 });
    }

    const result =
      platform === "youtube" ? await streamYoutube(url) : await streamTikTok(url);

    return new Response(Readable.toWeb(result.stream) as ReadableStream, {
      headers: {
        "Content-Type": result.contentType,
        "Content-Disposition": `attachment; filename="${result.filename}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Download gagal." },
      { status: 500 },
    );
  }
}
