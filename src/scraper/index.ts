import type { ChangelogEntry } from "../types";
import { load } from "cheerio";
import { loadPastRssMap } from "../rss/pastRssParser";

const CHANGELOG_URL =
  "https://feedback.minecraft.net/hc/en-us/sections/360001186971-Release-Changelogs";

function parsePostedDate(text: string): string {
  const postedMatch = text.match(/Posted:\s*(.+)/);
  if (!postedMatch || !postedMatch[1]) {
    throw new Error("Date not found");
  }

  const dateStr = postedMatch[1].trim();
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  return date.toISOString();
}

export async function fetchChangelogs(): Promise<ChangelogEntry[]> {
  const response = await fetch(CHANGELOG_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch changelogs: ${response.status}`);
  }

  const html = await response.text();
  const $ = load(html);

  const links: string[] = [];
  $(".article-list-link").each((_, element) => {
    const href = $(element).attr("href");
    if (href) {
      links.push(`https://feedback.minecraft.net${href}`);
    }
  });

  const pastRssMap = await loadPastRssMap();
  const entries: ChangelogEntry[] = [];

  for (const link of links.slice(0, 10)) {
    const articleResponse = await fetch(link);
    if (!articleResponse.ok) {
      console.warn(
        `Failed to fetch article: ${link} (status: ${articleResponse.status})`,
      );
      continue;
    }

    const articleHtml = await articleResponse.text();
    const article$ = load(articleHtml);

    const title = article$(".article-title").text().trim();
    const content = article$(".article-body").text().trim();

    let date: string;
    try {
      date = parsePostedDate(content);
    } catch (error) {
      const pastDate = pastRssMap.get(link);
      if (pastDate) {
        console.warn(
          `Using past RSS date for ${link}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        date = pastDate;
      } else {
        console.warn(
          `Using current timestamp for ${link}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        date = new Date().toISOString();
      }
    }

    if (title) {
      entries.push({
        title,
        date,
        link,
        content,
      });
    } else {
      console.warn(`Skipping article without title: ${link}`);
    }
  }

  return entries;
}
