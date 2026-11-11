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
  // No token: serve the tool list statically (tools.json) so clients and directories can introspect it.
  // Calling a tool returns an error asking for APIFY_TOKEN.
  const fs = require("node:fs");
  const path = require("node:path");
  const all = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "tools.json"), "utf8"));
  const wanted = new Set(tools.split(",").map((t) => t.trim().replace("/", "--")));
  const list = all.filter((t) => wanted.has(t.name));
  const send = (m) => process.stdout.write(JSON.stringify({ jsonrpc: "2.0", ...m }) + "\n");
  const handle = (msg) => {
    const { id, method, params } = msg;
    if (id === undefined) return; // notification
    if (method === "initialize") {
      const v = params && params.protocolVersion;
      send({ id, result: {
        protocolVersion: ["2024-11-05", "2025-03-26", "2025-06-18"].includes(v) ? v : "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "apify-mcp-tools", version: require("../package.json").version },
      } });
    } else if (method === "tools/list") send({ id, result: { tools: list } });
    else if (method === "tools/call") {
      send({ id, result: { isError: true, content: [{ type: "text", text: "Set APIFY_TOKEN (free Apify account) to run this tool." }] } });
    } else if (method === "ping") send({ id, result: {} });
    else send({ id, error: { code: -32601, message: "Method not found: " + method } });
  };
  let buf = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (d) => {
    buf += d;
    let i;
    while ((i = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, i).trim();
      buf = buf.slice(i + 1);
      if (!line) continue;
      try { handle(JSON.parse(line)); } catch (e) { send({ id: null, error: { code: -32700, message: "Parse error" } }); }
    }
  });
  process.stdin.on("end", () => process.exit(0));
  return;
}

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const child = spawn(npx, ["-y", "@apify/actors-mcp-server", "--tools", tools], {
  stdio: "inherit",
  env: process.env,
});
child.on("exit", (code, signal) => process.exit(signal ? 1 : code ?? 0));
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => child.kill(sig));
