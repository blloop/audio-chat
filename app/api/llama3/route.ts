import Replicate from "replicate";

// Initialize the Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

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

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response("Prompt is required", { status: 400 });
    }

    const streamIterator = replicate.stream("meta/meta-llama-3-8b-instruct", {
      input: { prompt },
    });

    // Convert the async iterator to a ReadableStream
    const readableStream = iteratorToStream(streamIterator as any);

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
