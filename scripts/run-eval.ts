#!/usr/bin/env npx tsx
/**
 * CLI eval runner — hits the eval harness directly (no HTTP server needed).
 *
 * Usage: npm run eval
 * Requires: LLM_API_KEY, EVAL_SECRET (optional for CLI — runs in-process)
 */

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const { runEval } = await import("../src/lib/eval/runner");

  console.log("Running ChatCV eval harness...\n");

  const report = await runEval();

  for (const result of report.results) {
    const icon = result.passed ? "✓" : "✗";
    console.log(`${icon} [${result.category}] ${result.id}`);
    if (!result.passed) {
      for (const failure of result.failures) {
        console.log(`    ↳ ${failure}`);
      }
      console.log(`    Response: ${result.response.slice(0, 120)}...`);
    }
  }

  console.log(
    `\n${report.passed}/${report.total} passed (${report.failed} failed)`,
  );

  process.exit(report.failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Eval failed:", err);
  process.exit(1);
});
