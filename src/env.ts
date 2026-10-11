// Read an environment variable on Deno or on runtimes exposing `process.env`
// (Node, Cloudflare Workers with nodejs_compat).
export function getEnv(key: string): string | undefined {
  // deno-lint-ignore no-explicit-any
  const runtime = globalThis as any;
  if (runtime.Deno?.env) {
    return runtime.Deno.env.get(key);
  }
  return runtime.process?.env?.[key];
}
