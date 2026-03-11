<h1 align="center">Claude Teams Go</h1>

<p align="center"><strong>Single window, multi-agent — one command launches an entire team.</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-D4A5A5?style=flat-square" alt="MIT License">
  <img src="https://img.shields.io/badge/Claude_Code-hooks-B8A9C9?style=flat-square" alt="Claude Code hooks">
  <img src="https://img.shields.io/badge/Dependencies-Zero-A8B5A0?style=flat-square" alt="Zero Dependencies">
</p>

<p align="center">
  <b>English</b> &nbsp;|&nbsp; <a href="README.zh-TW.md">繁體中文</a> &nbsp;|&nbsp; <a href="README.ja.md">日本語</a>
</p>

---

## Why?

You already pay for Claude Code. You already know how to write markdown. Why should running a multi-agent team require anything more?

**The problem:**

- Official Claude Code Agent Teams is experimental and limited
- Tools like Claude Flow require Node.js, databases, and heavy setup for 64-agent orchestration you don't need
- Claude Squad runs agents in parallel, but they never actually *talk to each other*
- Most solutions demand you learn a new framework before you get any value

**The fix:**

Claude Teams Go gives you structured multi-agent collaboration using only **Hooks + Markdown**. No runtime. No package manager. No new language to learn. Define a blueprint, run `/teams`, and your agents collaborate through a clear pipeline — with built-in quality gates.

---

## :gear: How It Works

```
You                Conductor              Task Agents           Resident Roles          You
 |                     |                       |                      |                  |
 |-- requirement ----->|                       |                      |                  |
 |                     |-- dispatch (parallel)->|                      |                  |
 |                     |                       |-- results ---------->|                  |
 |                     |                       |              Empath writes version A     |
 |                     |                       |              Architect writes version B  |
 |                     |                       |              Judge merges + checks       |
 |                     |                       |              Polisher refines            |
 |                     |                       |                      |-- delivery ------>|
 |                     |                       |                      |<-- feedback ------|
 |                     |                       |                      |-- final --------->|
```

**Five phases, one pipeline:**

| Phase | Who | What happens |
|-------|-----|-------------|
| 0 | **Conductor** (Claude Code) | Receives your request, clarifies if needed, picks a blueprint, dispatches agents |
| 1 | **Task Agents** | Parallel workers — research, plan, draft, analyze (defined per blueprint) |
| 2 | **Empath + Architect** | Two assemblers work in parallel: one for emotional resonance, one for structural strength |
| 3 | **Judge** | Merges both versions, runs checklist, rejects if quality gates fail |
| 4 | **Polisher** | Final refinement, then delivers to you and negotiates until you're satisfied |

You only talk to two people: the **Conductor** at the start, and the **Polisher** at the end.

---

## :package: Quick Start

### 1. Clone

```bash
git clone https://github.com/HelloRuru/claude-teams-go.git
cd claude-teams-go
```

### 2. Copy into your project

```bash
# Copy roles, blueprints, and commands to your .claude directory
cp -r roles/ ~/.claude/roles/
cp -r blueprints/ ~/.claude/blueprints/
cp -r commands/ ~/.claude/commands/

# Install the hook
cp hooks/teams-router.js ~/.claude/hooks/
```

### 3. Launch

```
/teams
```

That's it. The hook watches your prompts, detects blueprint triggers, and asks before launching — never auto-fires.

---

## :brain: Blueprint System

Blueprints are markdown files that define *what agents to spawn* and *how they collaborate*. They live in `blueprints/` and follow a simple format:

```markdown
# Blueprint: copywriting

## Meta
name: copywriting
triggers: [copywriting, write FB, write post]
description: Produce a complete piece of copy from scratch

## Agents
| id | role | task | memory |
|----|------|------|--------|
| A1 | planner | {assigned at runtime} | project-data |
| A2 | planner | {assigned at runtime} | — |
| B  | keyword-specialist | {assigned at runtime} | writing-rules |

## Flow
parallel: [A1, A2, B]
then: assembler
then: checker
then: polisher

## Checklist
- [ ] Deliverable addresses the original requirement
- [ ] Writing style matches project guidelines
- [ ] AI traces removed
```

Key points:

- **Task fields are never hardcoded** — the Conductor assigns them at runtime based on your actual request
- **Memory fields are optional** — they inject context from [claude-memory-engine](https://github.com/HelloRuru/claude-memory-engine) if installed
- **Blueprints aren't just for writing** — use them for deployments, research, code reviews, decision-making, anything

Start from the template: [`blueprints/_template.md`](blueprints/_template.md)

### Writing Your Own Blueprint

1. Copy `blueprints/_template.md` to `blueprints/my-task.md`
2. Fill in `## Meta` — give it a name, triggers (words that activate it), and a one-line description
3. Define `## Agents` — each row is a parallel worker. Leave the `task` column as `{assigned at runtime}` so the Conductor decides what each agent does based on your actual request
4. Set `## Flow` — list agents to run in parallel, then the pipeline: `assembler -> checker -> polisher`
5. Add `## Checklist` — the Judge uses this to decide pass/fail. Be specific: vague checks get vague results
6. (Optional) Add `## Roles Memory` — if you use [claude-memory-engine](https://github.com/HelloRuru/claude-memory-engine), map roles to memory files for automatic context injection

That's it. Run `/teams`, mention a trigger word, and the Conductor picks your blueprint.

---

## :speech_balloon: Commands

| English | 中文 | What it does |
|---------|------|-------------|
| `/teams` | `/組隊` | Launch a team from a blueprint |
| `/blueprint` | `/規劃` | List, create, or edit blueprints |
| `/roles` | `/角色設定` | View or modify resident roles |

All commands have separate English and Chinese files, written naturally in each language.

---

## Resident Roles

Four permanent roles that stay consistent across every task:

### Empath (Assembler A — Sensibility)

Finds the warmest angle. Transforms raw information into relatable scenes with emotional resonance, storytelling, and natural rhythm.

### Architect (Assembler B — Rationality)

Builds the most persuasive structure. Ensures keywords land naturally and arguments are backed by logic and data.

### Judge (Checker)

Receives both versions. Determines the ideal sensibility-to-rationality ratio based on the task. Merges, runs the checklist, and rejects anything that doesn't meet quality gates.

### Polisher

Your sole point of contact at delivery. Handles tone tuning, redundancy removal, rhythm adjustment, and final AI-trace scanning. Negotiates with you until the result is right.

---

## :link: Memory Integration

Claude Teams Go works standalone. But pair it with [claude-memory-engine](https://github.com/HelloRuru/claude-memory-engine), and your agents get project context automatically:

| Condition | Behavior |
|-----------|----------|
| Memory engine detected | Blueprint `memory` fields are injected into subagent prompts |
| Memory engine not found | Skipped gracefully — agents work from the blueprint alone |
| Resident roles | Can also load memory via the `Roles Memory` section |

This means your project context, style guides, and reference data can flow into every agent without manual copy-pasting.

---

## :dart: Features

| What | How |
|------|-----|
| Inter-agent collaboration | Agents share results through a structured pipeline — not just parallel, they actually talk |
| Dual-perspective assembly | Every task gets two takes: Empath (emotional resonance) + Architect (structural strength), then merged |
| Built-in quality gates | Judge role runs checklists before anything reaches you. Fails get sent back, not shipped |
| Human-in-the-loop delivery | Polisher negotiates with you until you're satisfied — not a one-shot dump |
| Blueprint system | Define teams in plain Markdown. No YAML, no config files, no new syntax to learn |
| Memory integration | Optional — pairs with [claude-memory-engine](https://github.com/HelloRuru/claude-memory-engine) to auto-inject project context |
| Bilingual commands | English + Chinese, each written natively — not translated, but authored in the language |
| Dependencies | Zero. One `.js` hook + Markdown files. That's it |
| Setup time | ~2 minutes from clone to first team launch |
| Extensible | Write your own blueprints for any workflow: writing, deployment, code review, research, decision-making |

---

## :open_file_folder: File Structure

```
claude-teams-go/
├── roles/                    # Resident role definitions
│   ├── assembler-empath.md
│   ├── assembler-architect.md
│   ├── checker.md
│   └── polisher.md
├── blueprints/               # Team blueprints
│   └── _template.md
├── hooks/                    # Hook router
│   └── teams-router.js
├── commands/                 # Slash commands (EN + ZH)
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

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  Made by <a href="https://ohruru.com">HelloRuru</a> -- because the best tools are the ones you already have.
</p>
