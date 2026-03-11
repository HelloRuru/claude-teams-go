---
description: View or modify the four resident role personas.
---

# /roles — Resident Role Management

View and modify the four permanent roles that participate in every blueprint workflow.

## The Four Resident Roles

| Role | Codename | File |
|------|----------|------|
| Assembler A | Empath (Sensibility) | `roles/assembler-empath.md` |
| Assembler B | Architect (Rationality) | `roles/assembler-architect.md` |
| Checker | Judge | `roles/checker.md` |
| Polisher | Polisher | `roles/polisher.md` |

## Subcommands

Parse `$ARGUMENTS` to determine the subcommand. If no subcommand is given, default to `list`.

---

### `/roles list`

1. Scan the `roles/` directory for all `.md` files.
2. For each role file, read the first few lines to extract the role name and codename.
3. Present as a table:

```
Resident Roles:

| Codename | Role | File | Status |
|----------|------|------|--------|
| Empath | Assembler A | roles/assembler-empath.md | OK / Missing |
| Architect | Assembler B | roles/assembler-architect.md | OK / Missing |
| Judge | Checker | roles/checker.md | OK / Missing |
| Polisher | Polisher | roles/polisher.md | OK / Missing |
```

4. If any role file is missing, flag it and suggest creating it.

---

### `/roles show <name>`

1. Map the given name to a file. Accept any of these: the codename (`empath`, `architect`, `judge`, `polisher`), the role name (`assembler-empath`, `assembler-architect`, `checker`), or partial matches.
2. Name mapping:
   - `empath` / `assembler-empath` / `assembler-a` / `a` -> `roles/assembler-empath.md`
   - `architect` / `assembler-architect` / `assembler-b` / `b` -> `roles/assembler-architect.md`
   - `judge` / `checker` -> `roles/checker.md`
   - `polisher` -> `roles/polisher.md`
3. If the file doesn't exist, report it and suggest creating one.
4. Read and display the full content.
5. Add a brief summary of the role's responsibilities and boundaries.

---

### `/roles edit <name>`

1. Map the name to a file using the same mapping as `show`.
2. If the file doesn't exist, ask if the user wants to create it.
3. Read and display the current content.
4. Ask the user what they want to change.
5. Apply edits using the Edit tool.
6. Show the updated file.
7. Remind the user that changes affect all future blueprint runs.

---

## Error Handling

| Situation | Action |
|-----------|--------|
| roles/ directory missing | Create it and inform the user |
| Role name not recognized | Show the name mapping table and ask the user to pick one |
| File exists but is empty | Warn and offer to populate from a default template |
