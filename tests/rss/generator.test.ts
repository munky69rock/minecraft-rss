import { describe, it, expect } from "bun:test";
import { generateRSS } from "../../src/rss/generator";
import type { ChangelogEntry } from "../../src/types";

describe("generateRSS", () => {
  it("should generate RSS with single entry", () => {
    const entries: ChangelogEntry[] = [
      {
        title: "Minecraft 1.20.0 Release",
        date: "2023-06-07T00:00:00Z",
        link: "https://feedback.minecraft.net/hc/en-us/articles/123456789",
        content: "New features and improvements",
      },
    ];

    const rss = generateRSS(entries);

    expect(rss).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(rss).toContain('<rss version="2.0">');
    expect(rss).toContain("<title>Minecraft Release Changelogs</title>");
    expect(rss).toContain("<item>");
    expect(rss).toContain("<title>Minecraft 1.20.0 Release</title>");
  });

  it("should include all entry fields in RSS", () => {
    const entries: ChangelogEntry[] = [
      {
        title: "Minecraft 1.20.0 Release",
        date: "2023-06-07T00:00:00Z",
        link: "https://feedback.minecraft.net/hc/en-us/articles/123456789",
        content: "New features and improvements",
      },
    ];

    const rss = generateRSS(entries);

    expect(rss).toContain(
      "<link>https://feedback.minecraft.net/hc/en-us/articles/123456789</link>",
    );
    expect(rss).toContain("<pubDate>Wed, 07 Jun 2023 00:00:00 GMT</pubDate>");
    expect(rss).toContain(
      "<description>New features and improvements</description>",
    );
  });

  it("should generate RSS with multiple entries", () => {
    const entries: ChangelogEntry[] = [
      {
        title: "Minecraft 1.20.0 Release",
        date: "2023-06-07T00:00:00Z",
        link: "https://feedback.minecraft.net/hc/en-us/articles/123456789",
        content: "First release",
      },
      {
        title: "Minecraft 1.21.0 Update",
        date: "2023-07-15T00:00:00Z",
        link: "https://feedback.minecraft.net/hc/en-us/articles/987654321",
        content: "Second release",
      },
    ];

    const rss = generateRSS(entries);

    expect(rss).toContain("<title>Minecraft 1.20.0 Release</title>");
    expect(rss).toContain("<title>Minecraft 1.21.0 Update</title>");
  });
});
