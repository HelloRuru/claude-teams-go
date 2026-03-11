# Claude Teams Go — Product Planning

> Run Team Agent workflows with your existing Claude Code subscription. No extra cost.

## Product Overview

| Item | Detail |
|------|--------|
| **Name** | Claude Teams Go |
| **Repo** | `HelloRuru/claude-teams-go` (public) |
| **Pitch** | Single window, multi-agent — one command launches an entire team. |
| **Core Value** | Get Team Agent results using Claude Code's existing subscription — for free. |
| **Tech** | Hooks + Markdown, zero dependencies |
| **Standalone** | Yes — works without any external engine |
| **With claude-memory-engine** | Subagents auto-load project memory for stronger context |
| **vs. Official Team Agent** | Free, configured via markdown blueprints — if you can write markdown, you can use it |

---

## Core Architecture

### Role System

Three role types:

#### 1. Conductor — Main Agent (Claude Code itself)

- Clarifies requirements (asks user if insufficient)
- Reads the blueprint
- Breaks requirements into actionable pieces
- Dispatches subagents
- Collects results and passes them downstream

#### 2. Resident Roles — Four permanent roles, consistent across tasks

| Role | Codename | Focus |
|------|----------|-------|
| Assembler A | **Empath** (Sensibility) | Emotional resonance, storytelling, rhythm |
| Assembler B | **Architect** (Rationality) | Structure, keyword placement, data-backed arguments |
| Checker | **Judge** | Merges both versions into one deliverable + runs Checklist |
| Polisher | **Polisher** | Final refinement; the user's sole point of contact at delivery |

#### 3. Task Agents — Dispatched per blueprint, different every time

Spawned based on the blueprint's `Agents` table. The Conductor fills in each agent's task at runtime based on the actual requirement.

---

## Complete Workflow

### Phase 0: Conductor — Receive & Clarify

- User gives a one-line request
- Conductor evaluates: is the requirement clear enough?
- **Not clear** -> Ask the user (Purpose? Audience? Any specific direction?)
- **Clear** -> Match blueprint -> Break into pieces -> Dispatch
- Underlying principle: **everything traces back to the requirement**

### Phase 1: Task Agents (Parallel)

- As many subagents as the blueprint defines, all launched simultaneously
- Each subagent works from the requirement
- Three execution modes:
  - **parallel**: Independent work, no cross-reference needed
  - **compete**: Same role, multiple approaches — pick the strongest
  - **discuss**: Different roles exchange and refine (configurable rounds)

### Phase 2: Assembler A + B (Parallel)

- Both receive all subagent results simultaneously
- **A (Empath)**: Picks the warmest angle, writes a version with vivid imagery
- **B (Architect)**: Builds the most persuasive structure, keywords naturally placed

### Phase 3: Judge (Checker)

- Receives both versions
- Determines sensibility/rationality ratio (based on task nature)
- Merges into one deliverable
- Runs Checklist (first item is always: **does it address the requirement?**)
- **Fail** -> Returns to the responsible Assembler (tone issues -> A, structure issues -> B)

### Phase 4: Polisher

- Receives the Judge-approved version
- Tone adjustments, typo/redundancy removal, rhythm tuning, final AI-trace scan
- Delivers to user

### Phase 5: User Negotiation

- Polisher discusses with the user (not a fire-and-forget delivery)
- **User satisfied** -> Done
- **User unsatisfied** -> Negotiate with Polisher
  - Polisher decides: minor fix -> self-correct; major issue -> coordinate upstream
- **User only talks to two people**: Conductor at the start, Polisher at the end

---

## Blueprint Format

```markdown
# Blueprint: copywriting

## Meta
name: copywriting
triggers: [copywriting, write FB, write post, write copy]
description: Produce a complete piece of copy from scratch

## Agents
| id | role | task | memory |
|----|------|------|--------|
| A1 | planner | {Conductor assigns based on requirement / 指揮官依需求指派} | project-data |
| A2 | planner | {Conductor assigns based on requirement / 指揮官依需求指派} | — |
| A3 | planner | {Conductor assigns based on requirement / 指揮官依需求指派} | — |
| B  | keyword-specialist | Extract search intent + pain points / 提取搜尋意圖與痛點 | writing-rules |
| C  | visual-advisor | Suggest image direction / 建議配圖方向 | — |

## Flow
parallel: [A1, A2, A3, B, C]
then: assembler
then: checker
then: polisher

## Roles Memory
assembler-empath: style-guide
assembler-architect: writing-rules
checker: qa-rules
polisher: style-guide

## Checklist
- [ ] Deliverable addresses the original requirement
- [ ] Writing style matches project guidelines
- [ ] Banned terms check passed
- [ ] AI traces removed
- [ ] Word count meets requirement

## On Fail
retry: assembler
max_retry: 1
```

> **Note**: Planner `task` fields are filled by the Conductor at runtime based on the actual requirement — they are never hardcoded.

---

## Blueprint Use Cases

Blueprints are not limited to writing. The framework applies to any scenario:

| Category | Examples |
|----------|----------|
| **Writing** | Copywriting, long-form articles, social media posts |
| **Technical** | Website deployment, feature development |
| **Research** | Market research, competitor analysis |
| **Decision** | Pricing strategy, proposal evaluation |

All follow the same pipeline:
**Requirement -> Task Agents -> Assembler A+B -> Judge -> Polisher <-> User**

---

## Resident Role Personas

### Assembler A — Empath (Sensibility)

- **Core**: Emotional resonance, storytelling, rhythm
- **Responsible for**: Finding the warmest angle; transforming information into relatable scenes
- **Not responsible for**: Keyword placement, SEO structure

### Assembler B — Architect (Rationality)

- **Core**: Structure, keyword placement, data-backed arguments
- **Responsible for**: Building the most persuasive structure; ensuring keywords land naturally
- **Not responsible for**: Emotional coloring, tonal rhythm

### Checker — Judge

- **Core**: Synthesis + quality control + final decision
- Determines the sensibility/rationality ratio
- Takes tone and emotion from A, structure and logic from B
- Runs the Checklist (varies by blueprint)
- Fails -> returns to the responsible Assembler; max 1 retry

### Polisher — Polisher

- **Core**: Detail refinement + user's sole point of contact
- Tone tuning, typo/redundancy removal, rhythm adjustment, final AI-trace scan
- Negotiates with user (conversational, not directive)
- Self-fixes when possible; coordinates upstream when needed

---

## File Structure

```
claude-teams-go/
├── roles/
│   ├── assembler-empath.md
│   ├── assembler-architect.md
│   ├── checker.md
│   └── polisher.md
├── blueprints/
│   └── _template.md
├── hooks/
│   └── teams-router.js
├── commands/
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

## Command System (Bilingual)

| EN | ZH | Function |
|----|-----|----------|
| `/teams` | `/組隊` | Launch a blueprint |
| `/blueprint` | `/規劃` | Manage blueprints (list / new / edit) |
| `/roles` | `/角色設定` | View / modify resident roles |

Each command has separate EN and ZH files, written naturally in each language (not translated).

---

## Hook Design

**Single hook**: `teams-router.js`

| Item | Detail |
|------|--------|
| **Event** | `UserPromptSubmit` |
| **Behavior** | Scans `blueprints/` triggers on every user message |
| **Match** | Prompts: "Blueprint detected — launch?" (never auto-launches) |
| **No match** | Does nothing |
| **Multiple matches** | Lists all matches for the Conductor to choose |

---

## Integration with claude-memory-engine

| Condition | Behavior |
|-----------|----------|
| **Detection** | Checks if `~/.claude/projects/*/memory/MEMORY.md` exists |
| **Installed** | Reads the blueprint's `memory` column; injects corresponding memory into subagent prompts |
| **Not installed** | Skips memory injection; subagents rely on the blueprint's `task` description alone |
| **Resident roles** | Can also specify `Roles Memory` (optional) |

---

## Competitive Landscape

| Project | Stars | Language | How It Differs from Teams Go |
|---------|-------|----------|------------------------------|
| **[Claude Squad](https://github.com/smtg-ai/claude-squad)** | ~6.3k | Go | Session management via tmux — parallel agents, but **no inter-agent collaboration** |
| **[Claude Flow / Ruflo](https://github.com/ruvnet/ruflo)** | ~15.3k | TS/Node | Enterprise-grade platform with DB, 64 agents — **too heavy** |
| **[ccswarm](https://github.com/nwiizo/ccswarm)** | Low | Rust | Closest concept (master orchestration + worktree isolation), but **Rust ecosystem** |
| **[ComposioHQ](https://github.com/ComposioHQ/agent-orchestrator)** | ~3.8k | Python | CI/CD-layer orchestrator, not a CLI tool |
| **Claude Code Agent Teams** | — | Built-in | Official experimental feature, limited functionality |

### Our Niche

```
Claude Squad     -> Parallel, but no collaboration logic
Claude Flow      -> Collaboration, but too heavy
ccswarm          -> Collaboration, but Rust

Claude Teams Go  -> Lightweight + Collaboration + Hooks + Markdown
                    This position is currently empty.
```
