import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { startJobs } from "./jobs/index.js";

const server = createApp();

const httpServer = server.listen({
  port: env.PORT,
  host: "127.0.0.1",
});

httpServer.once("error", (err: NodeJS.ErrnoException) => {
  console.error("Failed to start API:", err.code, err.message);
  process.exit(1);
});

httpServer.once("listening", () => {
  console.log(`API on :${env.PORT}`);
  startJobs();
});
