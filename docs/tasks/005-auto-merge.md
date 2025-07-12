# Pull Requestの自動マージ

## 概要

- Pull Requestで、ciがすべてpassした場合自動でマージされるようにしたい

## 実装内容

GitHub Actionsを使用して、以下の条件でPull Requestを自動マージする機能を実装しました：

1. **Dependabot PRの自動マージ**
   - DependabotによるPRは、すべてのCIチェックがパスすれば自動的にマージされます

2. **ラベルによる制御**
   - `auto-merge`ラベルが付いたPRも自動マージの対象になります
   - 手動でPRに`auto-merge`ラベルを追加することで自動マージを有効化できます

3. **マージ方法**
   - Squash mergeを使用してコミット履歴をクリーンに保ちます

## 動作確認方法

### 1. Dependabot PRの場合

- 次回Dependabotが依存関係更新のPRを作成した際に自動的に動作します
- CIがすべて成功すると自動的にマージされます

### 2. 手動でテストする場合

1. テスト用のブランチを作成

   ```bash
   git checkout -b test/auto-merge
   ```

2. 軽微な変更を加えてコミット（例：READMEの更新）

   ```bash
   echo "\n<!-- test -->" >> README.md
   git add README.md
   git commit -m "test: auto-merge functionality"
   git push origin test/auto-merge
   ```

3. GitHubでPull Requestを作成

4. PRに`auto-merge`ラベルを追加
   - PR画面右側の「Labels」から`auto-merge`ラベルを追加
   - ラベルが存在しない場合は、リポジトリ設定から作成

5. CIが成功すると自動的にマージされることを確認

## 注意事項

- ワークフローは`GITHUB_TOKEN`を使用するため、追加のシークレット設定は不要です
- 手動でのマージも引き続き可能です
- 自動マージを無効にしたい場合は、`.github/workflows/auto-merge.yml`を削除またはコメントアウトしてください
