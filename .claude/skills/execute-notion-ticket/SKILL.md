---
name: execute-notion-ticket
description: Implement a Notion Kanban ticket end to end — code it with tests, open a PR with a proper title and description, self-review the diff, and confirm CI stays green. Use when the user says things like "execute DTA-69", "do ticket DTA-42", "implémente le ticket …", or passes a ticket key from the Kanban Technique board.
---

# Execute a Notion ticket

Implement a ticket from the **Kanban Technique** Notion board from start to a green PR. The ticket key is passed as an argument (e.g. `DTA-69`). Work autonomously through every phase below; do not stop half-way unless a phase genuinely requires a human decision.

**Ticket argument:** `$ARGUMENTS` (a key like `DTA-69`; the number after the dash is the `ID` auto-increment property).

## Board reference

- Board: **Kanban Technique** — https://app.notion.com/p/Kanban-Technique-412d4bce13b7492885f2dcb2ec86ae1b
- Data source: `collection://9b64ebb9-0958-4f79-ba0f-4c36577363e8`
- Properties: `Name` (title), `Status` (`Backlog` / `Not started` / `In progress` / `Done`), `Side` (`Project` / `Back` / `Front`), `Assign` (person), `ID` (auto-increment, key `userDefined:ID`, prefix `DTA-`).

If the Notion MCP tools are deferred, load them first with a single `ToolSearch` call:
`select:mcp__claude_ai_Notion__notion-query-data-sources,mcp__claude_ai_Notion__notion-fetch,mcp__claude_ai_Notion__notion-update-page,mcp__claude_ai_Notion__notion-create-comment`

## Non-negotiable project rules

Read `CLAUDE.md` before coding and honor it. In particular:
- **Tests are mandatory** for every change, following the test pyramid (see the Testing section of `CLAUDE.md`). No change is complete without them.
- **Never add code comments** (only machine-readable ones like `// eslint-disable-next-line`).
- **FSD** layering in `apps/web`; one module per domain in `apps/api`. Never import upward or cross-slice.
- All code and git artifacts in **English**; user-facing text may be French.
- **Never push to `main` or `develop`.** Work on a `feat/…` / `fix/…` branch.
- **Do not add `Co-Authored-By` lines** to commits (project rule).
- Follow **Conventional Commits**.

## Phase 1 — Read the ticket

1. Resolve the ID: `DTA-69` → `69`.
2. Fetch the row and its page content:
   ```
   notion-query-data-sources (sql):
   SELECT url, "Name", "Status", "Side" FROM "collection://9b64ebb9-0958-4f79-ba0f-4c36577363e8" WHERE "userDefined:ID" = <number>
   ```
   Then `notion-fetch` the returned page `url` to read the full description and acceptance criteria.
3. If the ticket is not found, or is ambiguous / lacks enough detail to implement safely, stop and ask the user rather than guessing.
4. Note the ticket's `Side` — it hints whether the work is `Front`, `Back`, or both.
5. Set the ticket `Status` to **In progress** (`notion-update-page`, `update_properties`) if it is not already.

## Phase 2 — Plan & branch

1. Restate the scope in one or two sentences and identify the files/layers to touch. Prefer the smallest change that satisfies the ticket.
2. Create a branch off `main`:
   ```bash
   git checkout main && git pull --ff-only
   git checkout -b feat/<short-english-slug>   # or fix/… — include the ticket key, e.g. feat/dta-69-meter-matricule
   ```

## Phase 3 — Implement with tests

1. Make the code change following the conventions above.
2. Add or update tests at the **lowest meaningful layer** (unit first), covering happy path **and** failure/edge cases. Keep any existing tests green — update fixtures the change legitimately affects.
   - `apps/web`: Vitest (`*.test.ts(x)`), colocated. Playwright only for a critical journey.
   - `apps/api`: Jest (`*.spec.ts`), colocated. `test:e2e` only for a critical flow.
3. Run the relevant checks until clean:
   ```bash
   # scope to the touched app(s)
   cd apps/web && pnpm test && pnpm lint          # + pnpm build if config/build affected
   cd apps/api && pnpm test && pnpm build
   ```
   From the root you can run everything with `pnpm test`, `pnpm lint`, `pnpm build`.

## Phase 4 — Commit & open the PR

1. Commit with a Conventional Commit message (no `Co-Authored-By`), e.g.
   `feat(derivations): matricule format per meter type (DTA-69)`.
2. Push and open the PR with `gh`:
   ```bash
   git push -u origin HEAD
   gh pr create --base main --title "<conventional title> (DTA-XX)" --body "<body>"
   ```
   - **Base branch:** `main`.
   - **Title:** concise, Conventional-Commit style, ending with the ticket key. The key `DTA-XX` **must** appear in the title (and/or branch name) — the merge automation reads it from there to close the ticket.
   - **Description:** sections — *Contexte* (link the Notion ticket + what/why), *Changements* (bullet list), *Tests* (what was added and how it was verified), *Notes* (interpretation choices / follow-ups). Write it in French to match the team; end the body with the harness-required attribution line if one applies.

## Phase 5 — Self-review

1. Run the built-in review on the diff: invoke the **`code-review`** skill (e.g. `/code-review` targeting the PR or current branch) at `medium` effort.
2. Triage findings: fix real correctness/security issues and clear reuse/simplification wins; for anything you deliberately skip, say why.
3. Re-run the affected tests/lint after applying fixes, and amend or add commits, then push.

## Phase 6 — Verify CI

1. Wait for CI and check results:
   ```bash
   gh pr checks --watch
   # or: gh run watch $(gh run list --branch <branch> --limit 1 --json databaseId -q '.[0].databaseId')
   ```
2. If any check fails, read the failing job logs (`gh run view <id> --log-failed`), fix the cause, push, and re-verify. Repeat until **all checks are green**.
3. Do not consider the ticket done while CI is red.

## Phase 7 — Wrap up

1. Post the PR link back on the Notion ticket as a comment (`notion-create-comment`) and leave `Status` at **In progress**.
2. **Do not set the ticket to Done.** That is handled automatically on merge by the `.github/workflows/notion-ticket-done.yml` workflow, which reads the `DTA-XX` key from the PR title/branch — so make sure the key is present there (Phase 4).
3. Report to the user: ticket summary, branch, PR URL, tests added, review outcome, and CI status.

## Stop-and-ask triggers

- Ticket not found, ambiguous, or blocked (e.g. "en attente de Julien").
- The change would require pushing to `main`/`develop`, deleting data, or another irreversible/outward action beyond opening the PR.
- CI fails for a reason outside the ticket's scope (flaky infra, unrelated pre-existing breakage).
- A required decision has no sensible default.
