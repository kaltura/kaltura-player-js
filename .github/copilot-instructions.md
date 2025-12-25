# Copilot Instructions for kaltura-player-js

## Repository Overview

This is the **Kaltura Player JS** - a modular HTML5 video player built on PlayKit JS. The player provides two variants:
- **OVP Player** (kaltura-ovp-player.js) - for Kaltura OVP (Online Video Platform)
- **Cloud TV Player** (kaltura-tv-player.js) - for Kaltura Cloud TV (OTT)

**Repository Stats:**
- Language: TypeScript (transpiled to ES5) with Flow type annotations
- Size: ~104 TypeScript/JavaScript source files, ~343MB total
- Runtime: Browser (ES6+ transpiled via Babel)
- Build Tool: Webpack 5, TypeScript 5.2.2
- Test Framework: Karma + Mocha
- Node Version: 20.x (required)
- Package Manager: Yarn 1.22.x

## Critical Setup Requirements

### 1. Installing Dependencies

**ALWAYS** set `GIT_TOKEN` environment variable before running `yarn install`:

```bash
GIT_TOKEN=dummy yarn install
```

**Why?** The `.npmrc` file references `${GIT_TOKEN}` for GitHub Packages authentication. Without this variable set, `yarn install` will fail with "Failed to replace env in config" error. Use `GIT_TOKEN=dummy` for local development (actual token not needed unless installing @kaltura packages from GitHub registry).

**Expected warnings (safe to ignore):**
- Peer dependency warnings for `@playkit-js/playkit-js-dash`, `@playkit-js/playkit-js-hls`
- Unmet peer dependency for `react@^16.8.3` in `react-redux`

### 2. Build Commands - Complete Workflow

**Build both player variants (full build):**
```bash
GIT_TOKEN=dummy yarn run build
```
This runs: `clean → build:ovp → build:ott → build:types` (~50 seconds total)

**Build individual player variants:**
```bash
GIT_TOKEN=dummy yarn run build:ovp    # Build OVP player (~20 seconds)
GIT_TOKEN=dummy yarn run build:ott    # Build Cloud TV player (~20 seconds)
```

**Build TypeScript declarations:**
```bash
GIT_TOKEN=dummy yarn run build:types   # Generate TypeScript .d.ts files (~8 seconds)
```

**Development builds (with watch mode):**
```bash
GIT_TOKEN=dummy yarn run watch:ovp     # Watch mode for OVP
GIT_TOKEN=dummy yarn run watch:ott     # Watch mode for OTT
```

**Build outputs (in `dist/` directory):**
- `kaltura-ovp-player.js` + `.map` + `.LICENSE.txt`
- `kaltura-tv-player.js` + `.map` + `.LICENSE.txt`
- `kaltura-player-js.d.ts` (TypeScript definitions)
- `translations/*.i18n.json` (UI translations)

**Build warnings (expected, safe to ignore):**
- Asset size limit warnings (player bundles ~2.4MB, exceeds 244KB recommendation)
- Webpack performance recommendations about code splitting
- API Extractor warnings about forgotten exports (ae-forgotten-export)
- Source map parsing failures from shaka-player

## Validation & Testing Commands

**ALWAYS run in this order before committing:**

1. **Lint:**
   ```bash
   GIT_TOKEN=dummy yarn run lint          # ESLint check (~4 seconds)
   GIT_TOKEN=dummy yarn run lint:fix      # Auto-fix linting issues
   ```

2. **Type Check:**
   ```bash
   GIT_TOKEN=dummy yarn run type-check    # TypeScript type checking (~4 seconds)
   ```

3. **Tests:**
   ```bash
   GIT_TOKEN=dummy yarn run test          # Full test suite in ChromeHeadless (~100 seconds)
   ```

   **Individual browser tests:**
   ```bash
   GIT_TOKEN=dummy yarn run test:chrome
   GIT_TOKEN=dummy yarn run test:firefox
   GIT_TOKEN=dummy yarn run test:safari
   ```

   **Debug mode:**
   ```bash
   DEBUG_UNIT_TESTS=1 GIT_TOKEN=dummy yarn run test:debug
   ```

4. **Code Formatting:**
   ```bash
   GIT_TOKEN=dummy yarn run prettier      # Auto-format code with Prettier
   ```

**Test Results:**
- Expected: ✔ 271 tests completed, ℹ 11 tests skipped
- Duration: ~1 min 30 seconds
- Console logs with error messages are normal test behavior

## CI/CD Pipeline

**Pull Request Checks** (`.github/workflows/run_tests.yaml`):
All PRs trigger parallel jobs that run:
1. `yarn run build` - Full build validation
2. `yarn run test` - Complete test suite
3. `yarn run type-check` - TypeScript validation
4. `yarn run build:types` - Type declarations build
5. `yarn run lint` - Code style validation

**Canary Deployment** (on push to `master` or `patch-version`):
Runs: `build lint type-check test` in sequence

**Critical:** All CI jobs use Node 20.x. Code must pass all these checks to merge.

## Project Structure

### Root Directory Layout
```
kaltura-player-js/
├── src/                    # TypeScript source code
│   ├── index.ts           # Main entry point
│   ├── kaltura-player.ts  # Core player class
│   ├── setup.ts           # Player setup logic
│   ├── ovp/               # OVP-specific code (player defaults, plugins, poster)
│   ├── ott/               # OTT-specific code (player defaults, plugins, poster)
│   ├── common/            # Shared code
│   │   ├── ads/          # Advertising controllers
│   │   ├── cast/         # Chromecast/remote playback
│   │   ├── playlist/     # Playlist management
│   │   ├── plugins/      # Plugin system
│   │   ├── storage/      # Local/session storage managers
│   │   └── utils/        # Utility functions
│   └── types/            # TypeScript type definitions
├── tests/                 # Karma test files
├── dist/                  # Build output (gitignored)
├── docs/                  # Documentation (API, configuration, guides)
├── demo/                  # Demo HTML files for development
├── samples/               # Sample implementations
├── webpack.config.js      # Webpack build configuration
├── karma.conf.js          # Test runner configuration
├── tsconfig.json          # TypeScript compiler config
├── .eslintrc             # ESLint rules
└── .prettierrc           # Prettier formatting rules
```

### Key Configuration Files

- **webpack.config.js:** Builds player with environment-based aliases (`playerType=ovp|ott`)
- **tsconfig.json:** TypeScript compiler settings (strict null checks, ES6 target)
- **tsconfig-lib.json:** Type declaration generation config
- **karma.conf.js:** Test configuration (ChromeHeadless, 50s timeout)
- **.eslintrc:** TypeScript ESLint with Prettier integration
- **.prettierrc:** 150 char line width, single quotes, 2-space indent
- **api-extractor.json:** Generates bundled `.d.ts` declarations

### Player Variants & Build Aliases

The build uses **webpack path aliases** that resolve differently based on `playerType`:
- `@playkit-js/playkit-js-providers` → `playkit-ovp-provider` OR `playkit-ott-provider`
- `player-defaults` → `src/ovp/player-defaults.ts` OR `src/ott/player-defaults.ts`
- `plugins-config-store` → `src/ovp/plugins/plugins-config-store.ts` OR `src/ott/plugins/plugins-config-store.ts`
- `poster` → `src/ovp/poster.ts` OR `src/ott/poster.ts`

**Critical:** Changes to shared interfaces may require updates to both OVP and OTT implementations.

## Code Style & Linting Rules

**ESLint Configuration:**
- TypeScript ESLint parser with Prettier integration
- Max line length: 150 characters (except JSON: 60)
- Explicit member accessibility required (public/private/protected)
- No console statements allowed (use appropriate logging)
- Prefer `const` over `let`, never use `var`
- Single quotes for strings, trailing commas avoided
- Arrow functions preferred over function expressions

**Prettier Settings:**
- Print width: 150
- Tab width: 2 spaces
- Single quotes: true
- Trailing commas: none
- Arrow parens: always

**EditorConfig:**
- Charset: UTF-8
- Indent: 2 spaces
- Line endings: LF
- Insert final newline: true
- Trim trailing whitespace: true

## Common Development Tasks

### Making Code Changes

1. **Before starting:** Run `GIT_TOKEN=dummy yarn install` if `node_modules` missing
2. **During development:** Use `yarn run watch:ovp` or `watch:ott` for live rebuilds
3. **Test changes:** Run specific tests with `yarn run test:watch`
4. **Before commit:** Run `yarn run lint:fix && yarn run type-check && yarn run test`

### Testing Changes Locally

**Serve development server:**
```bash
GIT_TOKEN=dummy yarn run serve:ovp    # Opens http://localhost:8080/player-ovp.html
GIT_TOKEN=dummy yarn run serve:ott    # Opens http://localhost:8080/player-ott.html
```

### Adding Dependencies

Before adding any dependency, check peer dependencies in package.json and ensure compatibility with Node 20.x and existing packages.

### Cleaning Build Artifacts

```bash
GIT_TOKEN=dummy yarn run clean        # Removes dist/* directory
```

## Known Issues & Workarounds

1. **GIT_TOKEN requirement:** Always prefix yarn commands with `GIT_TOKEN=dummy`
2. **Peer dependency warnings:** Safe to ignore warnings about playkit-js version mismatches
3. **Large bundle size warnings:** Expected; player bundles are intentionally ~2.4MB
4. **API Extractor warnings:** Forgotten export warnings from api-extractor are known and non-blocking
5. **Browserslist outdated warning:** May appear but doesn't affect builds

## Important Notes for Agents

- **Trust these instructions:** Only search for additional information if these instructions are incomplete or incorrect
- **Environment setup:** ALWAYS use `GIT_TOKEN=dummy` prefix for all yarn commands
- **Build before test:** CI runs `build` before `test`, replicate this locally
- **Player type matters:** Changes may need testing with both `build:ovp` AND `build:ott`
- **Type safety:** TypeScript strict null checks are enabled; handle nullability carefully
- **No Flow:** Despite Flow types in dependencies, this project uses TypeScript
- **Clean builds:** If encountering strange errors, try `yarn run clean` then rebuild

## Common PR Review Feedback & Best Practices

Based on review patterns in this repository, avoid these common issues:

### Code Quality
- **Don't introduce console.log statements** - ESLint will fail. Use proper logging mechanisms
- **Always run prettier before committing** - Code formatting must be consistent
- **Type annotations are required** - Add explicit return types to public methods
- **Avoid `any` types** - Use proper TypeScript typing or `unknown` with type guards
- **Handle null/undefined explicitly** - Strict null checks are enabled, don't assume values exist

### Testing
- **Write tests for new features** - Don't skip test coverage for new functionality
- **Don't break existing tests** - Run full test suite before submitting
- **Test both player variants** - If changes affect shared code, test OVP and OTT builds
- **Mock external dependencies** - Don't make real API calls in unit tests

### Build & Dependencies
- **Don't commit dist/ or node_modules/** - These are gitignored for a reason
- **Update package.json and yarn.lock together** - Run `yarn install` after dependency changes
- **Test the full build locally** - Don't rely solely on CI to catch build issues
- **Check bundle size impact** - Large increases in bundle size need justification

### Code Organization
- **Follow existing patterns** - Match the architecture of surrounding code
- **Keep changes focused** - Don't mix refactoring with feature additions
- **Update documentation** - If changing public APIs, update TSDoc comments
- **Maintain backward compatibility** - Breaking changes require major version bumps

### Git Hygiene
- **Write descriptive commit messages** - Explain what and why, not just what
- **Keep commits atomic** - One logical change per commit
- **Reference issue numbers** - Use "Resolves FEC-XXXX" format when applicable
- **Rebase on latest master** - Keep your branch up to date before submitting

### Common Mistakes to Avoid
- **Forgetting GIT_TOKEN prefix** - Will cause "Failed to replace env in config" errors
- **Not running lint before push** - CI will reject PRs with linting errors
- **Assuming browser APIs** - Code runs in player context, not standalone browser
- **Breaking IE11 compatibility** - Check Babel transpilation for ES5 compatibility
- **Hardcoding environment values** - Use configuration objects and player setup

### Performance Considerations
- **Avoid synchronous operations in playback path** - Keep video playback smooth
- **Debounce/throttle event handlers** - Don't overwhelm the event loop
- **Clean up event listeners** - Prevent memory leaks by removing listeners on destroy
- **Lazy load when possible** - Don't load everything upfront

### Security Best Practices
- **Sanitize user input** - Especially in configuration and plugin options
- **Validate external data** - Don't trust API responses blindly
- **Avoid inline event handlers** - Use addEventListener instead
- **No credentials in code** - Use environment variables or configuration
