# RSSのpubDateの修正

## 概要

- 現状RSSのpubDateの取得ができておらず、Invalid Dateになってしまっている
- @src/scraper/parser.ts の日付取得のセレクタ (`$("time.article-date").attr("datetime")`) がそもそも間違っている。 `$(".article-body p:has(strong)").text()` が `Posted: 3 July 2025` のような出力になるので、それを元に日付を扱う
- そもそもInvalid Dateになった場合はエラーにして実行を失敗させる
