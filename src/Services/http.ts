import { getEnv } from "../env.ts";
import { CONSTANTS } from "../utils.ts";

// Minimal fetch-based HTTP client so the service runs on Deno and Workers alike.
export const http = {
  async post(
    data: unknown,
    headers: Record<string, string> = {},
  ): Promise<{ data: unknown }> {
    const response = await fetch(
      getEnv("GITHUB_API") || CONSTANTS.DEFAULT_GITHUB_API,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // The GitHub API rejects requests without a User-Agent.
          "User-Agent": "github-profile-trophy",
          ...headers,
        },
        body: JSON.stringify(data),
      },
    );
    const text = await response.text();
    try {
      return { data: JSON.parse(text) };
    } catch {
      return { data: { message: text } };
    }
  },
};
