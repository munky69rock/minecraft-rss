import { describe, it, expect, mock } from "bun:test";
import { fetchChangelogs } from "../../src/scraper";

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

    const entries = await fetchChangelogs();

    expect(entries).toHaveLength(1);
    expect(entries[0]!.title).toBe("Minecraft 1.20.0 Release");
    expect(entries[0]!.date).toBe("2023-06-07T00:00:00Z");
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
});
