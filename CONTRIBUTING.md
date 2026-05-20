# Contributing

Thanks for helping users adopt the latest ESLint features with your codemods!

Using an AI coding agent (Codex, Cursor, Claude Code, Aider, etc.)? See [`AGENTS.md`](./AGENTS.md) — it is a short pointer back to this file and the common mistakes to avoid.

## Development setup

This repository uses **pnpm** (see `packageManager` in the root `package.json`), **git tags** for releases, and **Biome** (not Prettier/ESLint) for formatting and linting.

```bash
# Install dependencies (also wires the Husky pre-commit hook)
pnpm install

# Format all files
pnpm run format

# Check formatting without writing
pnpm run format:check

# Lint all files
pnpm run lint

# Lint and auto-fix
pnpm run lint:fix

# Run all codemod package tests
pnpm run test

# Typecheck all codemod packages
pnpm run check-types

# Same checks as CI (tests + typecheck)
pnpm run ci

# Verify URLs in tracked Markdown (also runs in CI)
pnpm run docs:links
```

Run one workspace package (the `pnpm --filter` value is the `name` field in that package's `package.json`):

```bash
pnpm --filter <package-name> test
pnpm --filter <package-name> check-types
```

For example:

```bash
pnpm --filter @eslint/v8-to-v9-config test
pnpm --filter @eslint/v8-to-v9-custom-rules check-types
```

Use Node **22** locally (see [`.nvmrc`](./.nvmrc)) to match CI.

## Pre-commit hook

After `pnpm install`, Husky runs **lint-staged** before each commit: Biome format and lint on staged files, plus targeted `pnpm test` when you touch `codemods/**/scripts/*.ts`. If something fails, fix or stage the updates and try again.

The hook only inspects **staged** files. Files you did not touch can still fail a full-repo `pnpm run format:check` / `pnpm run lint` — CI focuses on **changed** paths for pull requests.

## CI

**`.github/workflows/codemod-publish.yaml`** is the only release workflow. It triggers on:

- **Tag pushes** matching `*@v*` (e.g. `@eslint/v8-to-v9-config@v1.2.0`) — installs dependencies, runs `pnpm test` for the matched codemod package, then publishes to the Codemod registry.
- **Manual dispatch** — accepts a tag string for emergency re-publishes without re-pushing the tag.

Match the local checks (`pnpm run ci`) before you push.

## Before you open a PR

- **Issue**: Check for an existing issue, or open one first.
- **Safety**: Codemods must be safe, predictable, and idempotent (running twice should not change code again). Avoid mixing patterns with different safety levels.
- **Naming**: In `codemod.yaml`, the codemod name must start with `@eslint`, where `eslint` is this repo's GitHub org.
- **Tests**: Add multiple fixtures (positive and negative).
- **Docs**: Update the README for your codemod.

## Making changes

1. Create a branch from `main`.
2. Make your changes and add or update fixtures under `tests/<case>/`.
3. Run `pnpm run format`, `pnpm run lint`, and `pnpm run ci` to verify everything passes.
4. Open a pull request.

## Release workflow

Releases are tag-driven. To publish a codemod:

1. Bump `version` in the codemod's `package.json` **and** `codemod.yaml` (they must match).
2. Commit the version bump to `main`.
3. Create and push the tag — the format is `<name>@v<version>`:

```bash
git tag @eslint/v8-to-v9-config@v1.2.0
git push origin @eslint/v8-to-v9-config@v1.2.0
```

4. `.github/workflows/codemod-publish.yaml` picks up the tag, runs `pnpm test` for that codemod, and publishes it to the registry automatically.

For emergencies (re-publish without re-pushing a tag), trigger **Publish Codemod** manually via `workflow_dispatch` and supply the tag string.

Choose the semver bump: **patch** for fixes, **minor** for new features, **major** for breaking changes.

## Adding a new codemod

Scaffold a new codemod with the CLI:

```bash
npx codemod@latest init
```

New packages live under `codemods/`, for example:

```
codemods/v9/<slug>/
  scripts/codemod.ts   # JSSG transform
  tests/               # input / expected fixtures
  codemod.yaml         # manifest
  workflow.yaml
  package.json
  tsconfig.json
  README.md
```

Conventions:

- The codemod name in `codemod.yaml` must start with `@eslint` (e.g. `@eslint/v8-to-v9-config`).
- Match the `name` in `package.json` to the registry name.
- Keep rewrites conservative. If a step requires a human decision, prefer a detector or recipe parameter over an unsafe transform.
- Use an existing sibling codemod in the same migration folder as a template.

Test your codemod locally against a sample project:

```bash
cd /path/to/sample/project
npx codemod workflow run -w /path/to/my-codemod/workflow.yaml
```

## Package shape

Each codemod package should include:

- `package.json` with at least `test` and `check-types` scripts.
- `codemod.yaml`, `workflow.yaml`, `tsconfig.json`, `README.md`
- `scripts/codemod.ts`
- `tests/<case>/input.*` and `tests/<case>/expected.*`

Keep transformations atomic and verifiable with fixtures.

## Checks

| Command                   | What it does                        |
| ------------------------- | ----------------------------------- |
| `pnpm run format`         | Auto-format with Biome              |
| `pnpm run format:check`   | Check formatting (no writes)        |
| `pnpm run lint`           | Lint with Biome                     |
| `pnpm run lint:fix`       | Lint and auto-fix with Biome        |
| `pnpm run test`           | Run all codemod tests               |
| `pnpm run check-types`    | Typecheck all codemod packages      |
| `pnpm run ci`             | Full check (test + typecheck)       |

## Pull requests

- Describe the codemod and its migration use case.
- Follow [Conventional Commits](https://www.conventionalcommits.org/):

| Type       | Usage                                  |
| ---------- | -------------------------------------- |
| `feat`     | New codemod or capability              |
| `fix`      | Bugfix in a transform or test          |
| `docs`     | Documentation-only changes             |
| `refactor` | Non-feature, non-bugfix code changes   |
| `test`     | Add or update fixtures/tests           |
| `chore`    | Tooling, CI, formatting, repo hygiene  |

## License

By contributing, you agree that your work will be licensed under the MIT License.
