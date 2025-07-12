# Minecraft RSS

## 目的

- <https://feedback.minecraft.net/hc/en-us/sections/360001186971-Release-Changelogs> から、HTMLの内容を解析し、Minecraftの最新バージョンのリリースについてRSSとして情報を取得できるようにしたい

## 要件

- 一日一回、0:00 UTCに当該URLにアクセス、最新情報を取得してRSSを更新する
- GitHubの無料の仕組みでRSSファイルを配信し、RSSアプリで購読できるようにする (rawファイルアクセス、GitHub Pagesなど)
- データベースなどのミドルウェアは利用しない。ストレージが必要な場合、ファイルやGitHubのWorkflow artifactsなどを利用すること

## 技術スタック

- Bun, TypeScript, Node.js
- GitHub Actions
