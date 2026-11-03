// Cloudflare Pages entry point: every path is handled by the Worker in worker.ts.
import worker from "../worker.ts";

interface PagesContext {
  request: Request;
  env: unknown;
  waitUntil(promise: Promise<unknown>): void;
}

export const onRequest = (context: PagesContext): Promise<Response> =>
  worker.fetch(context.request, context.env, context);
