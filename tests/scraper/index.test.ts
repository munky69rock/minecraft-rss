import { describe, it, expect, mock } from "bun:test";
import { fetchChangelogs } from "../../src/scraper";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

describe("fetchChangelogs", () => {
  it("should fetch and parse changelog page", async () => {
    const listPageHtml = `
      <div class="section-tree">
        <ul>
          <li>
            <a href="/hc/en-us/articles/123456789" class="article-list-link">
              Minecraft 1.20.0 Release
            </a>
          </li>
        </ul>
      </div>
    `;

    const articlePageHtml = `
      <article class="article">
        <header class="article-header">
          <h1 class="article-title">Minecraft 1.20.0 Release</h1>
          <time class="article-date" datetime="2023-06-07T00:00:00Z">June 7, 2023</time>
        </header>
        <div class="article-body">
          <p>New features and improvements in this release.</p>
        </div>
      </article>
    `;

    global.fetch = mock((url: string) => {
      if (url.includes("sections")) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(listPageHtml),
        } as Response);
      } else {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(articlePageHtml),
        } as Response);
      }
    }) as unknown as typeof fetch;

    const beforeTest = new Date();
    const entries = await fetchChangelogs();
    const afterTest = new Date();

    expect(entries).toHaveLength(1);
    expect(entries[0]!.title).toBe("Minecraft 1.20.0 Release");

    // Since there's no Posted: date, it will use current timestamp as fallback
    const entryDate = new Date(entries[0]!.date);
    expect(entryDate.getTime()).toBeGreaterThanOrEqual(beforeTest.getTime());
    expect(entryDate.getTime()).toBeLessThanOrEqual(afterTest.getTime());

    expect(entries[0]!.link).toBe(
      "https://feedback.minecraft.net/hc/en-us/articles/123456789",
    );
    expect(entries[0]!.content).toContain("New features and improvements");
  });

  it("should handle fetch errors", async () => {
    global.fetch = mock(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      } as Response),
    ) as unknown as typeof fetch;

    expect(fetchChangelogs()).rejects.toThrow(
      "Failed to fetch changelogs: 404",
    );
  });

  it("should parse Posted: date format from article body", async () => {
    const listPageHtml = `
      <div class="section-tree">
        <ul>
          <li>
            <a href="/hc/en-us/articles/987654321" class="article-list-link">
              Minecraft 1.21.90 Update
            </a>
          </li>
        </ul>
      </div>
    `;

    const articlePageHtml = `
      <article class="article">
        <header class="article-header">
          <h1 class="article-title">Minecraft 1.21.90 Update</h1>
        </header>
        <div class="article-body">
          <p><strong>Posted:</strong> 3 July 2025</p>
          <p>Bug fixes and improvements.</p>
        </div>
      </article>
    `;

    global.fetch = mock((url: string) => {
      if (url.includes("sections")) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(listPageHtml),
        } as Response);
      } else {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(articlePageHtml),
        } as Response);
      }
    }) as unknown as typeof fetch;

    const entries = await fetchChangelogs();

    expect(entries).toHaveLength(1);
    expect(entries[0]!.title).toBe("Minecraft 1.21.90 Update");
    expect(entries[0]!.date).toBe("2025-07-03T00:00:00.000Z");
    expect(entries[0]!.content).toContain("Posted: 3 July 2025");
  });

  it("should use current timestamp when no date is found", async () => {
    const listPageHtml = `
      <div class="section-tree">
        <ul>
          <li>
            <a href="/hc/en-us/articles/111111111" class="article-list-link">
              Entry Without Date
            </a>
          </li>
        </ul>
      </div>
    `;

    const articlePageHtml = `
      <article class="article">
        <header class="article-header">
          <h1 class="article-title">Entry Without Date</h1>
        </header>
        <div class="article-body">
          <p>No date information here.</p>
        </div>
      </article>
    `;

    global.fetch = mock((url: string) => {
      if (url.includes("sections")) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(listPageHtml),
        } as Response);
      } else {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(articlePageHtml),
        } as Response);
      }
    }) as unknown as typeof fetch;

    const beforeTest = new Date();
    const entries = await fetchChangelogs();
    const afterTest = new Date();

    expect(entries).toHaveLength(1);
    expect(entries[0]!.title).toBe("Entry Without Date");

    const entryDate = new Date(entries[0]!.date);
    expect(entryDate.getTime()).toBeGreaterThanOrEqual(beforeTest.getTime());
    expect(entryDate.getTime()).toBeLessThanOrEqual(afterTest.getTime());
  });

  it("should use past RSS date when available", async () => {
    const pastRssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Minecraft Release Changelogs</title>
    <item>
      <title>Old Entry</title>
      <link>https://feedback.minecraft.net/hc/en-us/articles/222222222</link>
      <pubDate>Mon, 01 Jan 2024 12:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

    await mkdir(join(process.cwd(), "dist"), { recursive: true });
    await writeFile(join(process.cwd(), "dist", "rss.xml"), pastRssContent);

    const listPageHtml = `
      <div class="section-tree">
        <ul>
          <li>
            <a href="/hc/en-us/articles/222222222" class="article-list-link">
              Entry From Past RSS
            </a>
          </li>
        </ul>
      </div>
    `;

    const articlePageHtml = `
      <article class="article">
        <header class="article-header">
          <h1 class="article-title">Entry From Past RSS</h1>
        </header>
        <div class="article-body">
          <p>No date information here.</p>
        </div>
      </article>
    `;

    global.fetch = mock((url: string) => {
      if (url.includes("sections")) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(listPageHtml),
        } as Response);
      } else {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(articlePageHtml),
        } as Response);
      }
    }) as unknown as typeof fetch;

    const entries = await fetchChangelogs();

    expect(entries).toHaveLength(1);
    expect(entries[0]!.title).toBe("Entry From Past RSS");
    expect(entries[0]!.date).toBe("2024-01-01T12:00:00.000Z");
  });
});
