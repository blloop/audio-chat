import { redis } from "../../../redis";

const MAX_REQUESTS = 64;

export async function GET(req: Request) {
  try {
    const ip =
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for") ||
      "unknown";

    if (!ip) {
      return new Response("Could not determine IP address", {
        status: 500,
      });
    }

    const key = `openai_rate_limit:${ip}`;
    const current = await redis.get(key);

    const count = parseInt((current as string) ?? "0", 10);
    const remaining = Math.max(MAX_REQUESTS - count, 0);

    return new Response(
      JSON.stringify({
        ip,
        count,
        remaining,
        limit: MAX_REQUESTS,
        expires_in_seconds: await redis.ttl(key),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
