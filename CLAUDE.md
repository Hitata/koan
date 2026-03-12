# CLAUDE.md — AI Assistant Guide for koan

This file provides context and conventions for AI assistants (Claude, Copilot, etc.) working in this repository. Keep it up to date as the project evolves.

---

## Repository Overview

**Project**: koan
**Status**: Newly initialized — no source files committed yet.
**Remote**: `http://local_proxy@127.0.0.1:34019/git/Hitata/koan`

> Update this section with the project's purpose, tech stack, and key dependencies once the codebase is established.

---

## Branch Strategy

| Branch prefix | Purpose |
|---|---|
| `main` / `master` | Stable, production-ready code |
| `feature/*` | New features |
| `fix/*` | Bug fixes |
| `claude/*` | AI-assisted development sessions |

**Active development branch for Claude sessions**: branches must start with `claude/` and include the session ID suffix (e.g., `claude/add-claude-documentation-5s5G0`).

Always push with:
```bash
git push -u origin <branch-name>
```

Never push directly to `main` without a pull request.

---

## Development Setup

> Fill in once the project is bootstrapped. Expected sections:

```bash
# Install dependencies
<package-manager> install

# Start dev server / run the project
<command>

# Run tests
<test-command>

# Lint & format
<lint-command>
```

---

## Project Structure

> Update this tree as files and directories are added.

```
koan/
├── CLAUDE.md          # This file
├── README.md          # Human-facing project documentation
└── ...                # Source files TBD
```

---

## Code Conventions

### General
- Prefer explicit over implicit.
- Keep functions small and focused on a single responsibility.
- Avoid premature abstractions — three similar lines beats a forced helper.
- Do not add comments unless the logic is non-obvious.
- Do not add docstrings, type annotations, or error handling to code you did not change.

### Naming
- Follow the conventions of the primary language used in the project.
- Be consistent with existing patterns in the file you are editing.

### Error Handling
- Only validate at system boundaries (user input, external APIs, file I/O).
- Trust internal code and framework guarantees — do not defensively guard against impossible states.

### Security
- Never commit secrets, tokens, or credentials.
- Sanitize all external input before use.
- Avoid introducing OWASP Top 10 vulnerabilities (XSS, SQL injection, command injection, etc.).

---

## Testing

> Fill in once a test framework is chosen. Expected content:
- Test runner and command
- Where tests live (`tests/`, `__tests__/`, `spec/`, etc.)
- Conventions for test file naming
- How to run a single test vs. the full suite

---

## CI/CD

> Fill in once a pipeline is configured (GitHub Actions, etc.).

---

## AI Assistant Instructions

### What to do
- Read files before editing them.
- Prefer editing existing files over creating new ones.
- Make the smallest change that satisfies the request.
- Mark todos complete immediately after finishing each step.
- Commit with clear, descriptive messages.

### What NOT to do
- Do not refactor, clean up, or improve code beyond what was requested.
- Do not add features, configuration options, or future-proofing not asked for.
- Do not use `--no-verify` or skip git hooks.
- Do not force-push to `main`.
- Do not delete files or branches without explicit user confirmation.
- Do not push to a branch other than the one specified for the session.

### Risky actions — always confirm first
- Deleting files or directories
- Dropping database tables or running destructive migrations
- Force-pushing (`git push --force`)
- Modifying CI/CD pipelines
- Sending messages or posting to external services

---

## Updating This File

Whenever a significant change is made to the project (new tech stack decision, new tooling, structural refactor, new conventions), update this file to reflect the current state of the codebase. Outdated guidance is worse than no guidance.
