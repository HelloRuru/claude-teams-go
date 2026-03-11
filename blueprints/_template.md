# Blueprint: {name}（{中文名}）

## Meta
name: {name}
triggers: [{中文觸發詞1}, {中文觸發詞2}, {英文觸發詞}]
description: {一句話說明這個 Blueprint 產出什麼}

## Agents

> Task Agents 由 Conductor 依 Blueprint 派遣。
> `task` 欄位在執行時根據實際需求填入 -- 不要寫死。
> `memory` 欄位選填；會把記憶檔注入 subagent 的 context（需要 claude-memory-engine）。

| id | role（角色） | task | memory |
|----|-------------|------|--------|
| A1 | {english-role}（{中文動詞}） | {Conductor 執行時指派} | {memory-file 或 --} |
| A2 | {english-role}（{中文動詞}） | {Conductor 執行時指派} | -- |
| B  | {english-role}（{中文動詞}） | {Conductor 執行時指派} | -- |

## Flow

> 執行順序。`parallel` 同時跑所有列出的 agent。
> `then` 把蒐集到的結果傳給下一階段。

parallel: [A1, A2, B]
then: assembler（組裝）
then: checker（審查）
then: polisher（潤稿）

## Roles Memory

> 選填。把記憶檔注入四個常駐角色。
> 需要 claude-memory-engine；沒裝的話自動跳過。

assembler-empath（組裝-感性）: {memory-file 或 --}
assembler-architect（組裝-理性）: {memory-file 或 --}
checker（審查）: {memory-file 或 --}
polisher（潤稿）: {memory-file 或 --}

## Checklist

> 審查必須通過的品質關卡，才能交給潤稿。
> 第一項固定是「符合需求」。

- [ ] 成品符合原始需求
- [ ] {品質標準 2}
- [ ] {品質標準 3}
- [ ] {品質標準 4}

## On Fail

> 審查不通過時怎麼辦。
> `retry` 指定回到哪個階段。`max_retry` 上限。

retry: assembler（組裝）
max_retry: 1
