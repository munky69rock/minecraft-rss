import type { ChangelogEntry } from "../types";

export function generateRSS(entries: ChangelogEntry[]): string {
  const items = entries
    .map((entry) => {
      const pubDate = new Date(entry.date).toUTCString();

      return `    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${escapeXml(entry.link)}</link>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(entry.content)}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Minecraft Release Changelogs</title>
    <link>https://feedback.minecraft.net/hc/en-us/sections/360001186971-Release-Changelogs</link>
    <description>Minecraft release changelogs</description>
${items}
  </channel>
</rss>`;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
