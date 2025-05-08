import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

// Initialize Replicate client with API token from environment variables
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const kokoroId =
  "jaaari/kokoro-82m:f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13";
// "lucataco/orpheus-3b-0.1-ft:79f2a473e6a9720716a473d9b2f2951437dbf91dc02ccb7079fb3d89b881207f";

export async function POST(req: NextRequest) {
  try {
    const { text, voice = "af_jessica" } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      console.error("REPLICATE_API_TOKEN environment variable not set.");
      return NextResponse.json(
        { error: "Server configuration error: Replicate API token missing." },
        { status: 500 },
      );
    }

    const input = { text: text, voice: voice };

    // Call the Replicate API
    const output = await replicate.run(kokoroId, { input });

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
        { status: 500 },
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
      { status: 500 },
    );
  }
}
