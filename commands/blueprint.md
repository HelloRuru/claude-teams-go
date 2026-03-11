---
description: Manage blueprints — list, create, edit, or view blueprint files.
---

# /blueprint — Blueprint Management

Manage the blueprint files that define team workflows.

## Subcommands

Parse `$ARGUMENTS` to determine the subcommand. If no subcommand is given, default to `list`.

---

### `/blueprint list`

1. Scan the `blueprints/` directory for all `.md` files.
2. Exclude `_template.md` from the main list (but mention it as the template).
3. For each blueprint, read the `## Meta` section and extract `name`, `triggers`, and `description`.
4. Present as a table:

```
Available Blueprints:

| Name | Triggers | Description |
|------|----------|-------------|
| ... | ... | ... |

Template: blueprints/_template.md
```

---

### `/blueprint new <name>`

1. Check if `blueprints/<name>.md` already exists. If yes, warn and ask to confirm overwrite.
2. Read `blueprints/_template.md`.
3. Copy the template to `blueprints/<name>.md`.
4. Replace all `{name}` placeholders with the given name.
5. Open the new file for the user and explain each section they need to fill in:
   - **Meta**: Set the triggers and description
   - **Agents**: Define the task agents (roles only; tasks are assigned at runtime)
   - **Flow**: Set execution order
   - **Roles Memory**: Optional memory file mappings
   - **Checklist**: Quality gates for the Checker
   - **On Fail**: Retry behavior
6. Ask the user if they want to fill it in now interactively or edit it later.

---

### `/blueprint edit <name>`

1. Check if `blueprints/<name>.md` exists.
2. If not found, run `list` and ask the user to pick one.
3. Read and display the current content.
4. Ask the user what they want to change.
5. Apply the edits using the Edit tool.
6. Show the updated file.

---

### `/blueprint show <name>`

1. Check if `blueprints/<name>.md` exists.
2. If not found, run `list` and ask the user to pick one.
3. Read and display the full blueprint content.
4. Add a brief interpretation:
   - How many agents will be dispatched
   - What the flow looks like
   - What the checklist covers

---

## Error Handling

| Situation | Action |
|-----------|--------|
| No blueprints/ directory | Create it and inform the user |
| Unknown subcommand | Show available subcommands |
| Name contains invalid characters | Warn and suggest a valid name (lowercase, hyphens, no spaces) |
