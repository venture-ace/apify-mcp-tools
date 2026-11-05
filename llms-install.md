# Install: Apify MCP Tools by Venture Ace (for Cline and other agents)

This suite is a set of hosted tools reached through Apify's MCP server. There is nothing to clone or build. The user
needs a free Apify account (https://console.apify.com); sign-in happens in the browser through OAuth.

## Steps

1. Add this server to the MCP settings file (in Cline: MCP Servers, Configure, `cline_mcp_settings.json`):

```json
{
  "mcpServers": {
    "venture-ace-tools": {
      "url": "https://mcp.apify.com?tools=venture_ace/chatgpt-search-visibility,venture_ace/ats-jobs-feed,venture_ace/audio-transcription,venture_ace/bulk-ocr,venture_ace/website-screenshot",
      "type": "streamableHttp"
    }
  }
}
```

2. On first connection a browser window opens to sign in to Apify. Ask the user to complete it.
3. If the client cannot open a browser or does not support remote servers, ask the user for an Apify API token
   (Apify Console, Settings, API & Integrations) and use this instead. Never print or store the token anywhere else:

```json
{
  "mcpServers": {
    "venture-ace-tools": {
      "command": "npx",
      "args": ["-y", "@apify/actors-mcp-server", "--tools",
               "venture_ace/chatgpt-search-visibility,venture_ace/ats-jobs-feed,venture_ace/audio-transcription,venture_ace/bulk-ocr,venture_ace/website-screenshot"],
      "env": { "APIFY_TOKEN": "<ask the user>" }
    }
  }
}
```

   This needs Node.js 18 or newer.
4. To confirm it works, list the tools; five Actor tools named after the Actors should appear. A cheap test is
   `venture_ace/website-screenshot` with one public URL.

## Notes for the agent

- Only keep the tools the user wants: list fewer names after `tools=`.
- `venture_ace/chatgpt-search-visibility` needs the user's own OpenAI API key as an input field. Ask for it at call time;
  do not write it into any file.
- Every tool takes URLs or lists as input and returns one result row per item with its own status; check each row's
  status, since a failed item is reported in its own row.
- Runs are billed by Apify to the user's Apify account (free monthly credit on the free plan); the suite adds no charge.
- Full details and per-tool links are in README.md.
