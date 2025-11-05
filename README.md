# minecraft-rss

A tool to generate RSS feeds from official Minecraft release changelogs.

## Overview

Fetches the latest release information from [Minecraft Feedback](https://feedback.minecraft.net/hc/en-us/sections/360001186971-Release-Changelogs) and generates RSS 2.0 format feeds.

You can subscribe to the generated RSS feed at:

```
https://raw.githubusercontent.com/munky69rock/minecraft-rss/main/dist/rss.xml
```

## Features

- Fetches the latest 10 release updates from the official Minecraft site
- Generates RSS 2.0 format feeds
- Daily automatic updates via GitHub Actions (0:00 UTC)
- Implemented using TDD (Test-Driven Development)

## Setup

### Install Dependencies

```bash
bun install
```

### Generate RSS Feed

```bash
bun run generate
```

The generated RSS feed will be saved to `dist/rss.xml`.

## Development

### Run Tests

```bash
bun test
```

### Run Linter

```bash
bun run lint
```

### Run Formatter

```bash
bun run format
```

## Project Structure

```
minecraft-rss/
├── src/
│   ├── index.ts          # Entry point
│   ├── scraper/          # Scraping related
│   │   ├── index.ts      # Main scraping logic
│   │   └── parser.ts     # HTML parsing logic
│   ├── rss/              # RSS generation related
│   │   └── generator.ts  # RSS generation logic
│   └── types.ts          # Type definitions
├── tests/                # Test files
├── dist/
│   └── rss.xml          # Generated RSS file
└── .github/workflows/
    └── update-rss.yml   # GitHub Actions configuration
```

## GitHub Actions

Automatically updates the RSS feed daily at 0:00 UTC. Manual execution is also available.

### Automatic Pull Request Merging

When all CI checks (tests, type checking, linting, format verification) pass, Pull Requests are automatically merged under the following conditions:

- Dependency update PRs from Dependabot
- PRs labeled with `auto-merge`

## Tech Stack

- [Bun](https://bun.sh) - JavaScript runtime
- TypeScript
- Cheerio - HTML parsing
- GitHub Actions - Automated updates
