import cron from "node-cron";
import { runCleanup } from "./cleanup.js";

export function startJobs() {
  cron.schedule(
    "15 * * * *",
    async () => {
      try {
        const result = await runCleanup();
        if (Object.values(result).some((n) => n > 0))
          console.log("[job:cleanup]", result);
      } catch (err) {
        console.error("[job:cleanup] failed", err);
      }
    },
    { name: "cleanup", noOverlap: true },
  );
}
