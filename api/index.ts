import "@std/dotenv/load";
import { CONSTANTS } from "../src/utils.ts";
import { staticRenderRegeneration } from "../src/StaticRenderRegeneration/index.ts";
import { GithubRepositoryService } from "../src/Repository/GithubRepository.ts";
import { GithubApiService } from "../src/Services/GithubApiService.ts";
import { cacheProvider } from "../src/config/cache.ts";
import { createApp, defaultHeaders } from "../src/app.ts";

const serviceProvider = new GithubApiService();
const client = new GithubRepositoryService(serviceProvider).repository;
const app = createApp(client, cacheProvider);

export default (request: Request) =>
  staticRenderRegeneration(request, {
    revalidate: CONSTANTS.REVALIDATE_TIME,
    headers: defaultHeaders,
  }, function (req: Request) {
    return app(req);
  });
