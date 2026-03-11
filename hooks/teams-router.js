#!/usr/bin/env node

// teams-router.js — Claude Code UserPromptSubmit hook
// Scans blueprints/ for trigger matches and notifies the user via stderr.
// Zero dependencies — pure Node.js.

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Path resolution
// ---------------------------------------------------------------------------

// Walk up from this file's directory to locate the project root that contains
// the blueprints/ folder. This works regardless of where the hook is
// installed (project .claude/hooks/ or user ~/.claude/hooks/).
function findBlueprintsDir() {
  let dir = __dirname;
  for (let i = 0; i < 5; i++) {
    const candidate = path.join(dir, "blueprints");
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return candidate;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break; // reached filesystem root
    dir = parent;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Blueprint Meta parser
// ---------------------------------------------------------------------------

// Extract `name`, `triggers`, and `description` from the ## Meta block.
// Keeps it simple — regex only, no YAML parser needed.
function parseMeta(content) {
  const meta = { name: null, triggers: [], description: null };

  const nameMatch = content.match(/^name:\s*(.+)$/m);
  if (nameMatch) meta.name = nameMatch[1].trim();

  const triggerMatch = content.match(/^triggers:\s*\[([^\]]*)\]/m);
  if (triggerMatch) {
    meta.triggers = triggerMatch[1]
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  const descMatch = content.match(/^description:\s*(.+)$/m);
  if (descMatch) meta.description = descMatch[1].trim();

  return meta;
}

// ---------------------------------------------------------------------------
// Collect all blueprint files
// ---------------------------------------------------------------------------

// Scans blueprints/ root (.md files, excluding _template.md) and
// blueprints/examples/ (.md files).
function collectBlueprints(blueprintsDir) {
  const files = [];

  // Root-level .md files (exclude _template.md)
  for (const entry of fs.readdirSync(blueprintsDir)) {
    if (
      entry.endsWith(".md") &&
      entry !== "_template.md"
    ) {
      files.push(path.join(blueprintsDir, entry));
    }
  }

  return files;
}

// ---------------------------------------------------------------------------
// Trigger matching
// ---------------------------------------------------------------------------

// Case-insensitive substring match of each trigger against the user prompt.
function findMatches(blueprints, prompt) {
  const lower = prompt.toLowerCase();
  return blueprints.filter((bp) =>
    bp.triggers.some((t) => lower.includes(t.toLowerCase()))
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // 1. Read stdin (Claude Code pipes the hook event as JSON)
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const input = Buffer.concat(chunks).toString("utf-8").trim();
  if (!input) process.exit(0);

  let payload;
  try {
    payload = JSON.parse(input);
  } catch {
    // Malformed input — silently exit so we never block the user.
    process.exit(0);
  }

  const prompt = payload.user_prompt;
  if (!prompt) process.exit(0);

  // 2. Locate blueprints/
  const blueprintsDir = findBlueprintsDir();
  if (!blueprintsDir) process.exit(0); // No blueprints folder — nothing to do.

  // 3. Parse all blueprints
  const files = collectBlueprints(blueprintsDir);
  if (files.length === 0) process.exit(0);

  const blueprints = [];
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, "utf-8");
      const meta = parseMeta(content);
      if (meta.name && meta.triggers.length > 0) {
        blueprints.push(meta);
      }
    } catch {
      // Skip unreadable files silently.
    }
  }

  // 4. Match triggers
  const matches = findMatches(blueprints, prompt);
  if (matches.length === 0) process.exit(0);

  // 5. Notify via stderr (visible to the user, does NOT block the prompt)
  if (matches.length === 1) {
    const bp = matches[0];
    process.stderr.write(
      `\n[Teams Go] Blueprint detected: "${bp.name}" — ${bp.description}\n` +
      `  Use /teams to launch this workflow.\n\n`
    );
  } else {
    const list = matches
      .map((bp) => `  - "${bp.name}": ${bp.description}`)
      .join("\n");
    process.stderr.write(
      `\n[Teams Go] Multiple blueprints matched:\n${list}\n` +
      `  Use /teams <name> to launch a specific workflow.\n\n`
    );
  }

  // 6. Exit cleanly — stdout stays empty so we never block the user prompt.
  process.exit(0);
}

main();
