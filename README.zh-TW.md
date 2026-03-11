<h1 align="center">Claude Teams Go</h1>

<p align="center"><strong>一個視窗、多個 Agent — 一條指令啟動整個團隊。</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-D4A5A5?style=flat-square" alt="MIT License">
  <img src="https://img.shields.io/badge/Claude_Code-hooks-B8A9C9?style=flat-square" alt="Claude Code hooks">
  <img src="https://img.shields.io/badge/Dependencies-Zero-A8B5A0?style=flat-square" alt="Zero Dependencies">
</p>

<p align="center">
  <a href="README.md">English</a> &nbsp;|&nbsp; <b>繁體中文</b> &nbsp;|&nbsp; <a href="README.ja.md">日本語</a>
</p>

---

## 為什麼需要這個？

你已經有 Claude Code 訂閱了。你也會寫 markdown。跑一個多 Agent 團隊，為什麼還要裝一堆東西？

**現有方案的問題：**

- 官方 Claude Code Agent Teams 還在實驗階段，功能有限
- Claude Flow 要裝 Node.js、資料庫，為了 64 個 Agent 的重量級架構——但你根本用不到那麼多
- Claude Squad 可以平行跑 Agent，但它們之間完全不會互相溝通
- 大多數方案都要你先學一套新框架，才能開始做事

**Claude Teams Go 的做法：**

只用 **Hooks + Markdown**，就能讓多個 Agent 有結構地協作。不需要安裝執行環境、不需要套件管理器、不需要學新語言。寫一份藍圖，跑 `/teams`（或 `/組隊`），你的 Agent 就會按照流程合作——還有內建的品質把關機制。

---

## :gear: 運作流程

```
你                  指揮官              任務 Agent             常駐角色              你
 |                     |                    |                     |                  |
 |-- 需求 ------------>|                    |                     |                  |
 |                     |-- 派遣（平行）----->|                     |                  |
 |                     |                    |-- 成果 ------------>|                  |
 |                     |                    |              感性組裝師寫 A 版          |
 |                     |                    |              理性組裝師寫 B 版          |
 |                     |                    |              審查官合併 + 檢查          |
 |                     |                    |              潤飾師精修                 |
 |                     |                    |                     |-- 交付 --------->|
 |                     |                    |                     |<-- 回饋 ---------|
 |                     |                    |                     |-- 定稿 --------->|
```

**五個階段，一條流水線：**

| 階段 | 負責人 | 做什麼 |
|------|--------|--------|
| 0 | **指揮官**（Claude Code 本身） | 接收需求、必要時追問、挑選藍圖、派遣 Agent |
| 1 | **任務 Agent** | 平行工作——調查、規劃、起草、分析（每份藍圖不同） |
| 2 | **感性 + 理性組裝師** | 兩位組裝師同時作業：一位負責情感共鳴，一位負責結構說服力 |
| 3 | **審查官** | 合併兩個版本、跑檢查表、不合格就退回 |
| 4 | **潤飾師** | 最終精修，交付給你，然後跟你來回討論到滿意為止 |

你只會跟兩個人對話：開頭的**指揮官**，和結尾的**潤飾師**。

---

## :package: 快速開始

### 1. 下載

```bash
git clone https://github.com/HelloRuru/claude-teams-go.git
cd claude-teams-go
```

### 2. 複製到你的專案

```bash
# 把角色、藍圖、指令複製到你的 .claude 目錄
cp -r roles/ ~/.claude/roles/
cp -r blueprints/ ~/.claude/blueprints/
cp -r commands/ ~/.claude/commands/

# 安裝 Hook
cp hooks/teams-router.js ~/.claude/hooks/
```

### 3. 啟動

```
/teams
```

或者用中文：

```
/組隊
```

就這樣。Hook 會偵測你的提示詞，發現匹配的藍圖時會先問你要不要啟動——不會自動開跑。

---

## :brain: 藍圖系統

藍圖是 markdown 檔案，定義「要派哪些 Agent」和「它們怎麼合作」。放在 `blueprints/` 裡，格式很簡單：

```markdown
# Blueprint: copywriting

## Meta
name: copywriting
triggers: [copywriting, write FB, write post]
description: 從頭產出一篇完整文案

## Agents
| id | role | task | memory |
|----|------|------|--------|
| A1 | planner | {執行時由指揮官分配} | project-data |
| A2 | planner | {執行時由指揮官分配} | — |
| B  | keyword-specialist | {執行時由指揮官分配} | writing-rules |

## Flow
parallel: [A1, A2, B]
then: assembler
then: checker
then: polisher

## Checklist
- [ ] 成果有回應原始需求
- [ ] 寫作風格符合專案規範
- [ ] AI 痕跡已清除
```

重點：

- **任務欄位不會寫死** — 指揮官在執行時根據你的實際需求分配
- **記憶欄位可選** — 搭配 [claude-memory-engine](https://github.com/HelloRuru/claude-memory-engine) 使用時，會自動注入上下文
- **藍圖不只能寫文章** — 部署、研究、程式碼審查、策略決策都能用

範本：[`blueprints/_template.md`](blueprints/_template.md)

### 怎麼寫自己的藍圖

1. 複製 `blueprints/_template.md` 到 `blueprints/my-task.md`
2. 填 `## Meta` — 取個名字、寫觸發詞（會啟動這個藍圖的關鍵字）、一句話描述
3. 定義 `## Agents` — 每一列是一個平行工作的 Agent。`task` 欄位留 `{執行時由指揮官分配}`，讓指揮官根據你的實際需求決定
4. 設定 `## Flow` — 列出要平行跑的 Agent，接著走流水線：`assembler -> checker -> polisher`
5. 寫 `## Checklist` — 審查官用這個來判斷通過或退回。寫具體一點：模糊的檢查項目只會得到模糊的結果
6. （選用）加 `## Roles Memory` — 如果你用 [claude-memory-engine](https://github.com/HelloRuru/claude-memory-engine)，把角色對應到記憶檔案，就能自動注入上下文

就這樣。跑 `/teams`（或 `/組隊`），提到觸發詞，指揮官就會挑到你的藍圖。

---

## :speech_balloon: 指令

| 英文 | 中文 | 功能 |
|------|------|------|
| `/teams` | `/組隊` | 啟動藍圖、組建團隊 |
| `/blueprint` | `/規劃` | 管理藍圖（列表 / 新增 / 編輯） |
| `/roles` | `/角色設定` | 查看或修改常駐角色 |

英文和中文各有獨立的指令檔案，用各自的語言自然撰寫。

---

## 四個常駐角色

每次任務都會出動的固定班底：

### 感性組裝師（Empath）

找到最溫暖的切入角度。把原始資料轉化成有共鳴的場景，注重敘事節奏和情感張力。

### 理性組裝師（Architect）

搭建最有說服力的結構。確保關鍵字自然落位，論點有邏輯和資料支撐。

### 審查官（Judge）

同時收到兩個版本。依據任務性質決定感性和理性的配比，合併成一份成品，然後跑檢查表。不通過就退回給負責的組裝師，最多重來一次。

### 潤飾師（Polisher）

你在交付階段的唯一窗口。負責語氣調校、冗詞刪除、節奏調整、最終 AI 痕跡掃描。會跟你來回討論，不是丟了就跑。

---

## :link: 記憶整合

Claude Teams Go 可以獨立運作。但搭配 [claude-memory-engine](https://github.com/HelloRuru/claude-memory-engine)，你的 Agent 會自動取得專案脈絡：

| 狀態 | 行為 |
|------|------|
| 偵測到記憶引擎 | 藍圖的 `memory` 欄位會注入到 Agent 的提示詞中 |
| 沒有安裝 | 自動跳過——Agent 只靠藍圖的任務描述工作 |
| 常駐角色 | 也可以透過 `Roles Memory` 載入記憶（選用） |

這代表你的專案脈絡、風格指南、參考資料，都能自動流入每個 Agent，不用手動複製貼上。

---

## :dart: 特色

| 項目 | 說明 |
|------|------|
| Agent 之間會協作 | 透過結構化流水線傳遞成果 — 不只是平行跑，它們真的會互相溝通 |
| 雙視角組裝 | 每個任務都有兩個版本：感性組裝師（情感共鳴）+ 理性組裝師（結構說服力），再合併 |
| 內建品質把關 | 審查官角色在交付前跑檢查表，不合格就退回，不會硬送 |
| 人在迴圈中 | 潤飾師會跟你來回討論到滿意為止 — 不是丟了就跑 |
| 藍圖系統 | 用純 Markdown 定義團隊，不用 YAML、不用設定檔、不用學新語法 |
| 記憶整合 | 選用 — 搭配 [claude-memory-engine](https://github.com/HelloRuru/claude-memory-engine) 自動注入專案脈絡 |
| 雙語指令 | 英文 + 中文，各自用母語原生撰寫 — 不是翻譯，是用那個語言寫的 |
| 安裝需求 | 零。一個 `.js` hook + Markdown 檔案，就這樣 |
| 設定時間 | 從下載到第一次組隊，約 2 分鐘 |
| 可擴充 | 自己寫藍圖，什麼工作流都能用：寫作、部署、程式碼審查、研究、策略決策 |

---

## :open_file_folder: 檔案結構

```
claude-teams-go/
├── roles/                    # 常駐角色定義
│   ├── assembler-empath.md
│   ├── assembler-architect.md
│   ├── checker.md
│   └── polisher.md
├── blueprints/               # 團隊藍圖
│   └── _template.md
├── hooks/                    # Hook 路由
│   └── teams-router.js
├── commands/                 # 斜線指令（英文 + 中文）
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
└── LICENSE
```

---

## 授權

MIT License。詳見 [LICENSE](LICENSE)。

---

<p align="center">
  Made by <a href="https://ohruru.com">HelloRuru</a> -- 因為最好的工具，就是你手邊已經有的。
</p>
