# Apify MCP Tools by Venture Ace

Seven small, single-purpose tools for AI agents, published as Apify Actors under the `venture_ace` account. Apify exposes
every public Actor as an MCP tool, so any MCP client (Claude, Cursor, Cline, VS Code and others) can call them through
Apify's MCP server. This repository holds the setup instructions and links; the tools run on Apify's platform.

| Tool | What it does | Apify Actor | Tool page |
|---|---|---|---|
| ChatGPT Search Visibility Tracker | Asks ChatGPT's web search your list of questions through the official OpenAI API (your own key) and reports whether your brand or domain is mentioned or cited: answer, cited URLs, first-mention position, per prompt. | [venture_ace/chatgpt-search-visibility](https://apify.com/venture_ace/chatgpt-search-visibility) | [page](https://chatgpt-search-visibility.pages.dev) |
| ATS Jobs Feed | One normalised job postings feed across Greenhouse, Lever, Ashby and Workday from company careers URLs, with salary, remote and new-jobs-only filters. | [venture_ace/ats-jobs-feed](https://apify.com/venture_ace/ats-jobs-feed) | [page](https://ats-jobs-feed.pages.dev) |
| Audio Transcription | Transcribes audio and video files from direct URLs with Whisper (faster-whisper): text, timed segments, SRT and VTT. One result row per file, each with its own status. | [venture_ace/audio-transcription](https://apify.com/venture_ace/audio-transcription) | [page](https://audio-transcription.pages.dev) |
| Bulk OCR | OCR for lists of image and PDF URLs with Tesseract. One result row per page with its own status (ok, no_text, unreadable, too_big, fetch_failed), confidence and optional lines. | [venture_ace/bulk-ocr](https://apify.com/venture_ace/bulk-ocr) | [page](https://bulk-ocr.pages.dev) |
| Website Screenshot | PNG or JPEG screenshots and PDFs of a list of URLs with headless Chromium: full page with lazy-load scrolling, desktop/tablet/mobile, wait for a selector, cookie banners hidden. | [venture_ace/website-screenshot](https://apify.com/venture_ace/website-screenshot) | [page](https://website-screenshot-pdf.pages.dev) |
| Video Frame Extractor | Frames from video file URLs with ffmpeg: every N seconds, every Nth frame, scene changes or exact timestamps, as JPG or PNG with timestamps. One result row per frame, and a status row for a bad link instead of a failed run. Direct file URLs only. | [venture_ace/video-frame-extractor](https://apify.com/venture_ace/video-frame-extractor) | [page](https://video-frames-to-images.pages.dev) |
| Broken Link Checker | Checks the links on a page or small site: ok, redirect, broken or blocked, one row per link. Every failure is confirmed with a GET, and bot-protected links are reported as blocked, not broken. Honours robots.txt. | [venture_ace/broken-link-checker](https://apify.com/venture_ace/broken-link-checker) | [page](https://check-broken-links.pages.dev) |

## Connect

Hosted server (recommended; sign in with your Apify account through OAuth the first time):

```json
{
  "mcpServers": {
    "venture-ace-tools": {
      "url": "https://mcp.apify.com?tools=venture_ace/chatgpt-search-visibility,venture_ace/ats-jobs-feed,venture_ace/audio-transcription,venture_ace/bulk-ocr,venture_ace/website-screenshot,venture_ace/video-frame-extractor,venture_ace/broken-link-checker"
    }
  }
}
```

Use only the tools you want by listing fewer names after `tools=`, for example `?tools=venture_ace/bulk-ocr`. To use
an API token instead of OAuth, add `"headers": { "Authorization": "Bearer <YOUR_APIFY_TOKEN>" }` (token from Apify
Console, API & Integrations).

Clients that only speak stdio can bridge to the hosted server with `npx -y mcp-remote "<the url above>"`, or run
Apify's own local server: `npx -y @apify/actors-mcp-server --tools venture_ace/bulk-ocr` with `APIFY_TOKEN` set in the
environment. Details: [Apify MCP docs](https://docs.apify.com/platform/integrations/mcp).

## Pricing and what you pay for

Each Actor is charged per event on Apify (pay-per-event), and the price is shown on its Actor page before you run it.
Current prices, in US dollars:

- ChatGPT Search Visibility Tracker: US$5 per 1,000 prompts answered
- ATS Jobs Feed: US$2 per 1,000 items (one item is one job)
- Audio Transcription: US$10 per 1,000 items (one item is one audio minute)
- Bulk OCR: US$4 per 1,000 items (one item is one page)
- Website Screenshot: US$4 per 1,000 items (one item is one captured page; failures are free)
- Video Frame Extractor: US$2 per 1,000 frames, US$0.002 each (one item is one extracted frame; failed frames are free). Set on 2026-11-07; Apify may delay the start by its notice period, and the Actor page shows the price that applies today.
- Broken Link Checker: US$1.50 per 1,000 links, US$0.0015 each (one item is one link with an ok, redirect or broken verdict; blocked, timeout, refused and skipped links are free). Set on 2026-11-07; the same notice-period caveat applies.
- Every run also carries Apify's standard actor-start event, US$0.00005 per run

The prices above are what you pay for a run; the suite adds no other fee. Until a newly set price takes effect on Apify,
a run is billed as ordinary Apify platform usage to the account that runs it (your own Apify account, which has a free
monthly credit on its free plan; see Apify's pricing page). The ChatGPT Search Visibility Tracker also needs your own
OpenAI API key, which you pass as an input and which is billed by OpenAI to you. Prices may change; the Actor page always
shows the current one.

## Honest limits

- These tools are new and have few users. We have not published accuracy figures. OCR (Tesseract) and transcription
  (Whisper) make errors on poor input, and each result row carries a status or confidence so you can see which items to
  trust.
- The jobs feed reads public careers pages and can break when a vendor changes its format.
- The ChatGPT tracker has been tested against the documented API response shape and a mock, not against a live OpenAI
  key.
- Tools return data; they do not take actions beyond fetching the URLs you give them.

## Support

Open an issue on this repository, or report a problem on the Actor's Apify page.

## Licence

MIT, see [LICENSE](LICENSE). This licence covers the contents of this repository; each Actor is governed by the Apify
Store terms and its own page.
