<h1 align="center">Claude Teams Go</h1>

<p align="center"><strong>ひとつのウィンドウ、複数のエージェント — コマンドひとつでチーム全体が動き出す。</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-D4A5A5?style=flat-square" alt="MIT License">
  <img src="https://img.shields.io/badge/Claude_Code-hooks-B8A9C9?style=flat-square" alt="Claude Code hooks">
  <img src="https://img.shields.io/badge/Dependencies-Zero-A8B5A0?style=flat-square" alt="Zero Dependencies">
</p>

<p align="center">
  <a href="README.md">English</a> &nbsp;|&nbsp; <a href="README.zh-TW.md">繁體中文</a> &nbsp;|&nbsp; <b>日本語</b>
</p>

---

## なぜ作ったか

Claude Code のサブスクリプションはもう持っている。Markdown も書ける。それなのに、マルチエージェントのチーム運用に追加のツールが必要だろうか？

**課題：**

- 公式の Claude Code Agent Teams は実験的で機能が限定的
- Claude Flow は Node.js + データベース + 大規模セットアップが必要 — 64 エージェント規模のオーケストレーションは過剰
- Claude Squad はエージェントを並列実行できるが、エージェント同士が*会話しない*
- 多くのツールは、価値を得る前に新しいフレームワークの学習を要求する

**解決策：**

Claude Teams Go は **Hooks + Markdown** だけで構造化されたマルチエージェント協業を実現する。ランタイム不要。パッケージマネージャ不要。新しい言語の学習不要。ブループリントを定義して `/teams` を実行すれば、エージェントが品質ゲート付きのパイプラインで協業する。

---

## :gear: 仕組み

```
あなた            指揮者              タスクエージェント      常駐ロール             あなた
 |                 |                       |                    |                    |
 |-- 要件 -------->|                       |                    |                    |
 |                 |-- 派遣（並列）-------->|                    |                    |
 |                 |                       |-- 結果 ----------->|                    |
 |                 |                       |            共感者が版 A を執筆           |
 |                 |                       |            設計者が版 B を執筆           |
 |                 |                       |            審査官が統合＋チェック        |
 |                 |                       |            研磨師が仕上げ               |
 |                 |                       |                    |-- 納品 ----------->|
 |                 |                       |                    |<-- フィードバック --|
 |                 |                       |                    |-- 最終版 --------->|
```

**5つのフェーズ、ひとつのパイプライン：**

| フェーズ | 担当 | 内容 |
|---------|------|------|
| 0 | **指揮者**（Claude Code 本体） | 要件を受け取り、必要なら確認し、ブループリントを選択してエージェントを派遣 |
| 1 | **タスクエージェント** | 並列ワーカー — 調査・企画・下書き・分析（ブループリントごとに定義） |
| 2 | **共感者 + 設計者** | 2つの組立役が並列で作業：ひとつは感情的な響き、もうひとつは構造的な強さ |
| 3 | **審査官** | 両バージョンを統合し、チェックリストを実行。品質基準を満たさなければ差し戻し |
| 4 | **研磨師** | 最終仕上げの後、納品。あなたが満足するまで調整を重ねる |

あなたが話す相手は2人だけ：最初に**指揮者**、最後に**研磨師**。

---

## :package: クイックスタート

### 1. クローン

```bash
git clone https://github.com/HelloRuru/claude-teams-go.git
cd claude-teams-go
```

### 2. プロジェクトにコピー

```bash
# ロール、ブループリント、コマンドを .claude ディレクトリにコピー
cp -r roles/ ~/.claude/roles/
cp -r blueprints/ ~/.claude/blueprints/
cp -r commands/ ~/.claude/commands/

# Hook をインストール
cp hooks/teams-router.js ~/.claude/hooks/
```

### 3. 起動

```
/teams
```

以上。Hook はプロンプトを監視し、ブループリントのトリガーを検出したら確認を求める — 自動起動はしない。

---

## :brain: ブループリントシステム

ブループリントは「どのエージェントを生成するか」と「どう協業するか」を定義する Markdown ファイル。`blueprints/` に配置し、以下のフォーマットに従う：

```markdown
# Blueprint: copywriting

## Meta
name: copywriting
triggers: [copywriting, write FB, write post]
description: ゼロからコピーを一本仕上げる

## Agents
| id | role | task | memory |
|----|------|------|--------|
| A1 | planner | {実行時に指揮者が割当} | project-data |
| A2 | planner | {実行時に指揮者が割当} | — |
| B  | keyword-specialist | {実行時に指揮者が割当} | writing-rules |

## Flow
parallel: [A1, A2, B]
then: assembler
then: checker
then: polisher

## Checklist
- [ ] 成果物が元の要件に対応している
- [ ] 文体がプロジェクトのガイドラインに一致
- [ ] AI の痕跡が除去済み
```

ポイント：

- **タスク欄は実行時に割り当て** — ハードコードしない。指揮者が実際の要件に基づいて決定する
- **メモリ欄はオプション** — [claude-memory-engine](https://github.com/HelloRuru/claude-memory-engine) がインストールされていれば自動注入
- **ブループリントは執筆だけじゃない** — デプロイ、調査、コードレビュー、意思決定にも使える

テンプレート: [`blueprints/_template.md`](blueprints/_template.md)

### 独自ブループリントの書き方

1. `blueprints/_template.md` を `blueprints/my-task.md` にコピー
2. `## Meta` を埋める — 名前、トリガー（起動キーワード）、一行の説明
3. `## Agents` を定義 — 各行が並列ワーカー。`task` 欄は `{実行時に指揮者が割当}` のままにして、指揮者が実際の要件に基づいて決定
4. `## Flow` を設定 — 並列実行するエージェントを列挙し、パイプラインへ：`assembler -> checker -> polisher`
5. `## Checklist` を書く — 審査官がこれを使って合否を判断。具体的に書くこと：曖昧なチェック項目は曖昧な結果しか生まない
6. （オプション）`## Roles Memory` を追加 — [claude-memory-engine](https://github.com/HelloRuru/claude-memory-engine) を使う場合、ロールをメモリファイルに対応させて自動注入

以上。`/teams` を実行し、トリガーワードを含めれば、指揮者があなたのブループリントを選択する。

---

## :speech_balloon: コマンド

| English | 中文 | 日本語 | 機能 |
|---------|------|--------|------|
| `/teams` | `/組隊` | `/teams` | ブループリントからチームを起動 |
| `/blueprint` | `/規劃` | `/blueprint` | ブループリントの一覧・作成・編集 |
| `/roles` | `/角色設定` | `/roles` | 常駐ロールの表示・変更 |

全コマンドに英語・中国語の個別ファイルあり。それぞれの言語で自然に書かれている。

---

## 常駐ロール

すべてのタスクで一貫して働く4つの固定ロール：

### 共感者（Empath — 組立A・感性）

最も温かい切り口を見つけ出す。生の情報を、感情的に響く場面・物語・自然なリズムに変換する。

### 設計者（Architect — 組立B・理性）

最も説得力のある構造を築く。キーワードが自然に着地し、論拠がデータに裏打ちされるように設計する。

### 審査官（Judge — チェッカー）

両バージョンを受け取り、タスクに応じた感性・理性の最適比率を判断。統合し、チェックリストを実行し、品質基準を満たさないものは差し戻す。

### 研磨師（Polisher）

納品時のあなたの唯一の窓口。語調の調整、冗長の除去、リズムの微調整、AI 痕跡の最終スキャンを担当。あなたが納得するまで対話を重ねる。

---

## :link: メモリ連携

Claude Teams Go は単体で動作する。だが [claude-memory-engine](https://github.com/HelloRuru/claude-memory-engine) と組み合わせると、エージェントにプロジェクトのコンテキストが自動的に注入される：

| 条件 | 動作 |
|------|------|
| メモリエンジン検出 | ブループリントの `memory` 欄がサブエージェントのプロンプトに注入 |
| メモリエンジン未検出 | スキップ — エージェントはブループリント単体で稼働 |
| 常駐ロール | `Roles Memory` セクションからもメモリ読込可能 |

プロジェクトのコンテキスト、スタイルガイド、参考データが、手動コピペなしですべてのエージェントに共有される。

---

## :dart: 特徴

| 項目 | 説明 |
|------|------|
| エージェント間協業 | 構造化パイプラインで成果を共有 — 並列実行だけでなく、実際に会話する |
| 二重視点の組立 | 毎タスクに2つの版：共感者（感情的共鳴）+ 設計者（構造的説得力）、統合して納品 |
| 内蔵の品質ゲート | 審査官が納品前にチェックリストを実行。不合格は差し戻し、そのまま出さない |
| ヒューマンインザループ | 研磨師があなたと対話を重ね、納得するまで調整 — 一方的な納品ではない |
| ブループリント | 純粋な Markdown でチームを定義。YAML不要、設定ファイル不要、新しい構文不要 |
| メモリ連携 | オプション — [claude-memory-engine](https://github.com/HelloRuru/claude-memory-engine) でプロジェクト文脈を自動注入 |
| 多言語コマンド | 英語 + 中国語、各言語でネイティブに執筆 — 翻訳ではなく、その言語で書かれている |
| 依存関係 | ゼロ。`.js` hook ひとつ + Markdown ファイル、それだけ |
| セットアップ時間 | クローンから初回チーム起動まで約2分 |
| 拡張可能 | 独自ブループリントであらゆるワークフローに対応：執筆、デプロイ、コードレビュー、調査、意思決定 |

---

## :open_file_folder: ファイル構成

```
claude-teams-go/
├── roles/                    # 常駐ロール定義
│   ├── assembler-empath.md
│   ├── assembler-architect.md
│   ├── checker.md
│   └── polisher.md
├── blueprints/               # チームブループリント
│   └── _template.md
├── hooks/                    # Hook ルーター
│   └── teams-router.js
├── commands/                 # スラッシュコマンド（EN + ZH）
│   ├── teams.md
│   ├── blueprint.md
│   ├── roles.md
│   ├── 組隊.md
│   ├── 規劃.md
│   └── 角色設定.md
├── skill/
│   └── SKILL.md
├── PLANNING.md
├── README.md
├── README.zh-TW.md
├── README.ja.md
└── LICENSE
```

---

## ライセンス

MIT License。詳細は [LICENSE](LICENSE) を参照。

---

<p align="center">
  Made by <a href="https://ohruru.com">HelloRuru</a> -- 最高のツールは、すでに手元にあるもの。
</p>
