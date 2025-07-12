import { load } from "cheerio";
import { readFile } from "fs/promises";
import { join } from "path";

export async function loadPastRssMap(): Promise<Map<string, string>> {
  const pastRssMap = new Map<string, string>();

  try {
    const rssPath = join(process.cwd(), "dist", "rss.xml");
    const rssContent = await readFile(rssPath, "utf-8");
    const $ = load(rssContent, { xmlMode: true });

    $("item").each((_, element) => {
      const link = $(element).find("link").text().trim();
      const pubDate = $(element).find("pubDate").text().trim();

      if (link && pubDate) {
        const isoDate = new Date(pubDate).toISOString();
        pastRssMap.set(link, isoDate);
      }
    });

    console.log(`Loaded ${pastRssMap.size} past RSS entries`);
  } catch {
    console.log("No past RSS file found or error reading it, starting fresh");
  }

  return pastRssMap;
}
