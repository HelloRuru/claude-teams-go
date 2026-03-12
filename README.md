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

**Current situation:**

- Official Claude Code Agent Teams is experimental and limited
- Most solutions demand you learn a new framework before you get any value

**The fix:**

Claude Teams Go gives you structured multi-agent collaboration using only **Hooks + Markdown**. No runtime. No package manager. No new language to learn. Define a blueprint, run `/teams`, and your agents collaborate through a clear pipeline — with built-in quality gates.

---

## :gear: How It Works

### Generic Flow (same for every blueprint)

```
You -- request --> Conductor -- dispatch --> Task Agents (parallel) -- results --> Integrator -- delivery --> You
                                                                                      ^            |
                                                                                      |-- feedback -|
```

| Phase | Who | What happens |
|-------|-----|-------------|
| 0 | **Conductor** (Claude Code itself) | Receives your request, clarifies if needed, picks a blueprint, dispatches agents |
| 1 | **Task Agents** | Parallel workers — research, plan, draft, analyze (defined per blueprint) |
| 2 | **Integrator** | Merges all agent outputs, runs checklist item by item, rejects if quality gates fail |

Your main contacts: **Conductor** at the start, **Integrator** at the end.

### Writing Blueprint Extended Flow

Writing blueprints add two collaborative roles and a polish stage before delivery:

```
Task Agents -- material --> Empath + Architect (co-write) -- draft --> Integrator -- review --> Polisher -- delivery --> You
```

| Extended Phase | Who | What happens |
|----------------|-----|-------------|
| 2a | **Empath + Architect** | Co-write: Empath handles emotion, Architect handles structure, together they produce a first draft |
| 2b | **Integrator** | Merges the draft, runs checklist item by item |
| 3 | **Polisher** | Cuts redundancy, adjusts tone, scans for AI traces, negotiates with you until you're satisfied |

Writing blueprint contacts: **Conductor** at the start, **Polisher** at the end.

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

> Fastest way: after installing, just tell Claude Code "write me a blueprint for OOO" and it'll generate one for you.

To write one manually:

1. Copy `blueprints/_template.md` to `blueprints/my-task.md`
2. Fill in `## Meta` — give it a name, triggers (words that activate it), and a one-line description
3. Define `## Agents` — each row is a parallel worker. Leave the `task` column as `{assigned at runtime}` so the Conductor decides what each agent does based on your actual request
4. Set `## Flow` — list agents to run in parallel, then the pipeline: `assembler -> checker -> polisher`
5. Add `## Checklist` — the Judge uses this to decide pass/fail. Be specific: vague checks get vague results
6. (Optional) Add `## Roles Memory` — if you use [claude-memory-engine](https://github.com/HelloRuru/claude-memory-engine), map roles to memory files for automatic context injection

That's it. Run `/teams`, mention a trigger word, and the Conductor picks your blueprint.

---

## :eyes: What It Looks Like in Action

### Generic Flow: Competitive Analysis

```
You: /teams Analyze three competitors — strengths and weaknesses

----------------------------------

Conductor launches
  "Got it. Matched the analysis blueprint.
   Goal: compare three competitors | Output: analysis report
   Dispatching 3 Agents in parallel."

----------------------------------

Phase 1 | Parallel Research

  Agent A -> Investigate Competitor A: features, pricing, reviews
  Agent B -> Investigate Competitor B: features, pricing, reviews
  Agent C -> Investigate Competitor C: features, pricing, reviews

  All three complete simultaneously

----------------------------------

Phase 2 | Merge & Check

  Integrator
  -> Merges three reports into a comparison table
     Runs checklist item by item... 6/6 passed. PASS.

----------------------------------

Phase 3 | Delivery

  "Done. Need any adjustments?"

  You: Add an after-sales support column
  Integrator: "Added."

  You: OK looks good
  -> Final report delivered
```

Also works for: event planning, research reports, decision analysis, proposal drafts, and more.

### Generic Flow: Vibe Coding

```
You: /teams Build an event registration page with a form and submission notifications

----------------------------------

Conductor launches
  "Got it. Matched the dev blueprint.
   Goal: event registration page | Requirements: form + notifications
   Dispatching 3 Agents in parallel."

----------------------------------

Phase 1 | Parallel Development

  Agent A -> Design page layout + form UI
  Agent B -> Write form submission logic + notification feature
  Agent C -> Handle deployment config + environment variables

  All three complete simultaneously

----------------------------------

Phase 2 | Merge & Check

  Integrator
  -> Assembles three outputs into a complete project
     Runs checklist item by item... 5/5 passed. PASS.

----------------------------------

Phase 3 | Delivery

  "Done. Want to run it first?"

  You: The form is missing a phone number field
  Integrator: "Added, and updated the validation logic too."

  You: OK deploy it
  -> Deployment complete
```

### Writing Blueprint Example

```
You: /teams Write an article about multi-agent task delegation, for AI enthusiasts

----------------------------------

Conductor launches
  "Got it. Matched the copywriting blueprint.
   Audience: AI enthusiasts | Platform: Blog | Topic: multi-agent delegation
   Dispatching 3 Agents in parallel."

----------------------------------

Phase 1 | Parallel Research

  Planner -> Produces article skeleton + section key points
  Researcher -> Gathers multi-agent use cases
  Keyword Specialist -> Extracts search intent + semantic keywords

  All three complete simultaneously

----------------------------------

Phase 2 | Co-writing

  Empath + Architect collaborate
  -> Empath handles emotion, Architect handles structure
     Together they produce a first draft

----------------------------------

Phase 3 | Merge & Check

  Integrator
  -> Merges the draft, runs checklist item by item
     8/8 passed. PASS.

----------------------------------

Phase 4 | Polish & Delivery

  Polisher (your main contact from here)
  -> Cuts redundancy, adjusts tone, scans for AI traces

  "Done — 1,200 words. Need any adjustments?"

----------------------------------

You: Make the opening more vivid
Polisher: "Revised. Switched the opening to a scene-setting approach."

You: OK looks good
  -> Final draft delivered
```

---

## :speech_balloon: Commands

| English | 中文 | What it does |
|---------|------|-------------|
| `/teams` | `/組隊` | Launch a team from a blueprint |
| `/blueprint` | `/規劃` | List, create, or edit blueprints |
| `/roles` | `/角色設定` | View or modify resident roles |

All commands have separate English and Chinese files, written naturally in each language.

---

## Universal Roles (present in every blueprint)

No matter what blueprint you run, these two always show up:

### Conductor

Your first point of contact. Receives your request, matches it to a blueprint, and dispatches Task Agents. Will ask clarifying questions if needed.

### Integrator (Judge)

Merges all agent outputs and runs the checklist item by item. Rejects anything that doesn't pass — never ships subpar work.

## Writing Blueprint Roles

Writing blueprints add three more:

### Empath

Handles the emotional side. Finds the warmest angle, transforms raw material into relatable scenes, and focuses on narrative rhythm and emotional resonance. Co-writes with the Architect.

### Architect

Handles the structural side. Builds the most persuasive framework, ensures keywords land naturally, and backs every argument with logic and data. Co-writes with the Empath.

### Polisher

Your sole point of contact at delivery. Handles tone tuning, redundancy removal, rhythm adjustment, and final AI-trace scanning. Negotiates with you until the result is right — not a one-shot dump.

## Need something different?

Add a row to `## Agents` in your blueprint and you have a new team member. You can also create new `.md` files in `roles/` to define permanent roles.

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
| Dual-perspective collaboration (writing) | Empath (emotion) + Architect (structure) co-write, then the Integrator merges and checks |
| Built-in quality gates | Integrator runs checklists before anything reaches you. Fails get sent back, not shipped |
| Human-in-the-loop delivery | Polisher negotiates with you until you're satisfied — not a one-shot dump |
| Blueprint system | Define teams in plain Markdown. No YAML, no config files, no new syntax to learn |
| Memory integration | Optional — pairs with [claude-memory-engine](https://github.com/HelloRuru/claude-memory-engine) to auto-inject project context |
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
