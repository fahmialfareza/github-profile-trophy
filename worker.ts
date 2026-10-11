// Cloudflare Workers entry point.
import { createApp } from "./src/app.ts";
import { GithubApiService } from "./src/Services/GithubApiService.ts";

const app = createApp(new GithubApiService());

export default {
  async fetch(
    request: Request,
    _env: unknown,
    ctx: { waitUntil(promise: Promise<unknown>): void },
  ): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/favicon.ico") {
      return new Response(null, { status: 404 });
    }
    if (request.method !== "GET") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    // Workers don't honour s-maxage on their own, so cache successful renders explicitly.
    // deno-lint-ignore no-explicit-any
    const cache = (caches as any).default as Cache;
    const cacheKey = new Request(url.toString(), { method: "GET" });
    const cached = await cache.match(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await app(request);
    if (response.ok) {
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
    }
    return response;
  },
};
