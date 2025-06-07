import Replicate, { ServerSentEvent } from "replicate";
import { redis } from "../../../redis";

// Initialize the Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

const MAX_REQUESTS = 64;
const SECONDS_IN_DAY = 86400;

// Helper function to convert async iterator to ReadableStream
function iteratorToStream(iterator: AsyncIterable<string>) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator[Symbol.asyncIterator]().next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(new TextEncoder().encode(value));
      }
    },
  });
}

async function* mapToStrings(
  source: AsyncGenerator<ServerSentEvent>
): AsyncGenerator<string> {
  for await (const event of source) {
    yield event.data;
  }
}

export async function POST(req: Request) {
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

    const key = `llama3_rate_limit:${ip}`;
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, SECONDS_IN_DAY);
    }

    if (current > MAX_REQUESTS) {
      return new Response("Too many requests", { status: 429 });
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return new Response("Prompt is required", { status: 400 });
    }

    const streamIterator = replicate.stream("meta/meta-llama-3-8b-instruct", {
      input: { prompt, max_new_tokens: 128 },
    });

    // Convert the async iterator to a ReadableStream
    const readableStream = iteratorToStream(mapToStrings(streamIterator));

    // Return a standard Response object with the stream
    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8", // Or application/octet-stream
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
