import { fetchChangelogs } from "./scraper";
import { generateRSS } from "./rss/generator";
import { writeFile } from "fs/promises";
import { join } from "path";

async function main() {
  try {
    console.log("Fetching Minecraft changelogs...");
    const entries = await fetchChangelogs();

    console.log(`Found ${entries.length} changelog entries`);
    const rss = generateRSS(entries);

    const outputPath = join(process.cwd(), "dist", "rss.xml");
    await writeFile(outputPath, rss, "utf-8");

    console.log(`RSS feed generated at: ${outputPath}`);
  } catch (error) {
    console.error("Failed to generate RSS feed:", error);
    process.exit(1);
  }
}

if (import.meta.main) {
  main();
}
