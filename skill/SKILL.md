# Claude Teams Go

## What It Does

Run multi-agent team workflows using your existing Claude Code subscription. No extra tools, no extra cost -- just Markdown blueprints and Claude Code Hooks. One command dispatches a team of specialized agents that research, draft, assemble, review, and polish your deliverable through a structured pipeline.

## Core Concept

```
User Request
    |
Conductor (Claude Code main agent)
    |-- clarifies requirements
    |-- selects blueprint
    |-- dispatches Task Agents
    v
Task Agents (parallel subagents)
    |
    v
Assembler A (Empath) + Assembler B (Architect)  [parallel]
    |
    v
Judge (Checker) -- merge + quality checklist
    |
    v
Polisher -- refine + deliver
    |
    v
User <-> Polisher negotiation
```

The Conductor breaks down the requirement and dispatches Task Agents. Two Assemblers then create competing drafts -- one emotional, one structural. The Judge merges the best of both versions and runs a quality checklist. The Polisher applies final refinements and delivers to the user.

## File Structure

```
roles/              Resident role personas (Empath, Architect, Judge, Polisher)
blueprints/         Workflow definitions -- each blueprint = one team configuration
  _template.md      Blank blueprint for creating new ones
hooks/              teams-router.js -- detects blueprint triggers on user input
commands/           Slash commands (/teams, /blueprint, /roles) in EN and ZH
```

## Quick Start

1. Copy `roles/` and `blueprints/` into your project root.
2. Install the hook: copy `hooks/teams-router.js` to `.claude/hooks/`.
3. Copy `commands/` to `.claude/commands/`.
4. Run `/teams` to launch a blueprint workflow.

That's it. No dependencies to install.

## Commands

| Command | Alias | What It Does |
|---------|-------|--------------|
| `/teams` | `/組隊` | Launch a blueprint workflow |
| `/blueprint` | `/規劃` | List, create, or edit blueprints |
| `/roles` | `/角色設定` | View or modify resident role personas |

## Blueprint Format

Each blueprint is a Markdown file with these sections:

| Section | Purpose |
|---------|---------|
| **Meta** | Name, trigger words, one-line description |
| **Agents** | Task Agent table -- roles and memory references (tasks assigned at runtime) |
| **Flow** | Execution order: `parallel`, `then` stages |
| **Roles Memory** | Optional memory file injection for resident roles |
| **Checklist** | Quality gates the Judge must verify before passing |
| **On Fail** | Retry behavior when the Judge rejects a deliverable |

See `blueprints/_template.md` for the full template.

## Memory Integration

Works standalone, but pairs with [claude-memory-engine](https://github.com/HelloRuru/claude-memory-engine) for richer context.

| Condition | Behavior |
|-----------|----------|
| Memory engine installed | Reads blueprint `memory` fields; injects memory into subagent prompts |
| Memory engine not installed | Skips injection; subagents rely on blueprint task descriptions alone |

## Resident Roles

Four permanent roles that stay consistent across every workflow:

| Role | Codename | Focus |
|------|----------|-------|
| Assembler A | **Empath** | Emotional resonance, storytelling, rhythm -- finds the warmest angle |
| Assembler B | **Architect** | Structure, keyword placement, evidence -- builds the most persuasive frame |
| Checker | **Judge** | Merges both versions, decides the empath/architect ratio, runs quality checklist |
| Polisher | **Polisher** | Final refinement, AI-trace removal, and sole point of contact with the user |
