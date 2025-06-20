import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { redis } from "../../../redis";

// Initialize Replicate client with API token from environment variables
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const MAX_REQUESTS = 64;
const SECONDS_IN_DAY = 86400;

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for") ||
      "unknown";

    if (!ip) {
      console.error("Could not determine IP address");
      return new Response("Could not determine IP address", {
        status: 500,
      });
    }

    const key = `minimax_rate_limit:${ip}`;
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, SECONDS_IN_DAY);
    }

    if (current > MAX_REQUESTS) {
      return new Response("Too many requests", { status: 429 });
    }

    const { text, voice_id = "Friendly_Person" } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      console.error("REPLICATE_API_TOKEN environment variable not set.");
      return NextResponse.json(
        {
          error: "Server configuration error: Replicate API token missing.",
        },
        { status: 500 }
      );
    }

    // Call the Replicate API
    const output = await replicate.run("minimax/speech-02-turbo", {input: {
      text,
      voice_id,
      sample_rate: 16000,
      bitrate: 32000
    }});

    // Check if the output is a ReadableStream
    if (output instanceof ReadableStream) {
      return new NextResponse(output, {
        status: 200,
        headers: {
          "Content-Type": "audio/wav",
        },
      });
    } else {
      console.error("Unexpected output format from Replicate:", output);
      return NextResponse.json(
        { error: "Unexpected response format from speech service" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error calling Replicate:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error during speech generation";
    return NextResponse.json(
      { error: "Failed to generate speech", details: errorMessage },
      { status: 500 }
    );
  }
}
