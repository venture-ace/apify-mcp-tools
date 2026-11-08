#!/usr/bin/env node
// Starts Apify's MCP server (stdio) with the seven venture_ace Actors as tools.
// Needs APIFY_TOKEN in the environment. Set APIFY_MCP_TOOLS to a comma list to use fewer tools.
const { spawn } = require("node:child_process");

const ALL = [
  "venture_ace/chatgpt-search-visibility",
  "venture_ace/ats-jobs-feed",
  "venture_ace/audio-transcription",
  "venture_ace/bulk-ocr",
  "venture_ace/website-screenshot",
  "venture_ace/video-frame-extractor",
  "venture_ace/broken-link-checker",
];
const tools = (process.env.APIFY_MCP_TOOLS || ALL.join(",")).trim();

if (!process.env.APIFY_TOKEN) {
  console.error("apify-mcp-tools: set APIFY_TOKEN (Apify Console > Settings > API & Integrations).");
  process.exit(1);
}

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const child = spawn(npx, ["-y", "@apify/actors-mcp-server", "--tools", tools], {
  stdio: "inherit",
  env: process.env,
});
child.on("exit", (code, signal) => process.exit(signal ? 1 : code ?? 0));
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => child.kill(sig));
