# minecraft-rss

Minecraft公式リリースチェンジログのRSSフィードを生成するツールです。

## 概要

[Minecraft Feedback](https://feedback.minecraft.net/hc/en-us/sections/360001186971-Release-Changelogs)から最新のリリース情報を取得し、RSS 2.0形式のフィードを生成します。

生成されたRSSフィードは以下のURLで購読できます：
```
https://raw.githubusercontent.com/[username]/minecraft-rss/main/dist/rss.xml
```

## 機能

- Minecraft公式サイトから最新10件のリリース情報を取得
- RSS 2.0形式でフィードを生成
- GitHub Actionsによる毎日自動更新（0:00 UTC）
- TDD（テスト駆動開発）で実装

## セットアップ

### 依存関係のインストール

```bash
bun install
```

### RSSフィードの生成

```bash
bun run generate
```

生成されたRSSフィードは `dist/rss.xml` に保存されます。

## 開発

### テストの実行

```bash
bun test
```

### リンターの実行

```bash
bun run lint
```

### フォーマッターの実行

```bash
bun run format
```

## プロジェクト構造

```
minecraft-rss/
├── src/
│   ├── index.ts          # エントリーポイント
│   ├── scraper/          # スクレイピング関連
│   │   ├── index.ts      # メインのスクレイピング処理
│   │   └── parser.ts     # HTML解析処理
│   ├── rss/              # RSS生成関連
│   │   └── generator.ts  # RSS生成処理
│   └── types.ts          # 型定義
├── tests/                # テストファイル
├── dist/
│   └── rss.xml          # 生成されるRSSファイル
└── .github/workflows/
    └── update-rss.yml   # GitHub Actions設定
```

## GitHub Actions

毎日0:00 UTCに自動的にRSSフィードを更新します。手動実行も可能です。

## 技術スタック

- [Bun](https://bun.sh) - JavaScriptランタイム
- TypeScript
- Cheerio - HTML解析
- GitHub Actions - 自動更新
