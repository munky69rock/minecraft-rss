import { load } from "cheerio";
import { ChangelogEntry } from "../types";

export function parseChangelogEntry(html: string): ChangelogEntry {
  const $ = load(html);
  const title = $(".article-title").text().trim();
  const date = $("time.article-date").attr("datetime") || "";

  const linkElement = $(".article-title a");
  const relativeLink = linkElement.attr("href") || "";
  const link = relativeLink
    ? `https://feedback.minecraft.net${relativeLink}`
    : "";

  const content = $(".article-body").text().trim();

  return {
    title,
    date,
    link,
    content,
  };
}
