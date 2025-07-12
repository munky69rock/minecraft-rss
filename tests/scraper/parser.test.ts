import { describe, it, expect } from "bun:test";
import { parseChangelogEntry } from "../../src/scraper/parser";

describe("parseChangelogEntry", () => {
  it("should extract title from changelog entry", () => {
    const html = `<article class="article">
      <header class="article-header">
        <h1 class="article-title">Minecraft 1.20.0 Release</h1>
      </header>
    </article>`;

    const result = parseChangelogEntry(html);

    expect(result.title).toBe("Minecraft 1.20.0 Release");
  });

  it("should extract different titles from different HTML", () => {
    const html = `<article class="article">
      <header class="article-header">
        <h1 class="article-title">Minecraft 1.21.0 Update</h1>
      </header>
    </article>`;

    const result = parseChangelogEntry(html);

    expect(result.title).toBe("Minecraft 1.21.0 Update");
  });

  it("should extract date from changelog entry", () => {
    const html = `<article class="article">
      <header class="article-header">
        <h1 class="article-title">Minecraft 1.20.0 Release</h1>
        <time class="article-date" datetime="2023-06-07T00:00:00Z">June 7, 2023</time>
      </header>
    </article>`;

    const result = parseChangelogEntry(html);

    expect(result.date).toBe("2023-06-07T00:00:00Z");
  });

  it("should extract link and content from changelog entry", () => {
    const html = `<article class="article">
      <header class="article-header">
        <h1 class="article-title">
          <a href="/hc/en-us/articles/123456789">Minecraft 1.20.0 Release</a>
        </h1>
      </header>
      <div class="article-body">
        <p>New features and improvements in this release.</p>
      </div>
    </article>`;

    const result = parseChangelogEntry(html);

    expect(result.link).toBe(
      "https://feedback.minecraft.net/hc/en-us/articles/123456789",
    );
    expect(result.content).toContain("New features and improvements");
  });
});
