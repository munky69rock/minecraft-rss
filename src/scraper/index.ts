import { ChangelogEntry } from "../types";
import { load } from "cheerio";

const CHANGELOG_URL =
  "https://feedback.minecraft.net/hc/en-us/sections/360001186971-Release-Changelogs";

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

  const entries: ChangelogEntry[] = [];

  for (const link of links.slice(0, 10)) {
    const articleResponse = await fetch(link);
    if (!articleResponse.ok) continue;

    const articleHtml = await articleResponse.text();
    const article$ = load(articleHtml);

    const title = article$(".article-title").text().trim();
    const date = article$("time.article-date").attr("datetime") || "";
    const content = article$(".article-body").text().trim();

    if (title) {
      entries.push({
        title,
        date,
        link,
        content,
      });
    }
  }

  return entries;
}
